use std::collections::HashMap;
use std::env::var as get_var;
use std::net::{Ipv4Addr, SocketAddrV4};
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;

use futures_util::{pin_mut, Stream, TryStreamExt};
use tokio::net::TcpListener;
use tokio::sync::RwLock;
use tokio::time::Instant;
use tokio_postgres::NoTls;

pub mod constants;
pub mod database;
#[cfg(feature = "metrics")]
pub mod metrics;
pub mod types;

use constants::{DEFAULT_TICK_COUNT, DEFAULT_TICK_TIME};
use database::{check_schema_version, row_to_json_value, select_status_count, select_statuses};
#[cfg(feature = "metrics")]
use metrics::Metrics;
use types::*;

pub struct Scheduler {
    postgres: PGClient,
    clients: ConnectedClients,
    delete_client: tokio::sync::mpsc::Sender<SocketAddr>,

    metrics_file: Option<String>,
    tick_count: u32,
    tick_delay: Duration,
}

impl Scheduler {
    pub async fn initialize(
        pg_config: tokio_postgres::Config,
        tick_count: u32,
        tick_delay: Duration,
        metrics_file: Option<String>,
        listen_addrs: Vec<ListenAddr>,
    ) -> PGResult<Self> {
        let clients = Arc::new(RwLock::new(HashMap::new()));
        let (delete_client, mut del_rx) = tokio::sync::mpsc::channel(128);

        let del_clients = Arc::clone(&clients);
        tokio::spawn(async move {
            while let Some(task) = del_rx.recv().await {
                println!("Deleting {:?}", task);
                del_clients.write().await.remove(&task);
            }
        });

        let (postgres, connection) = pg_config.connect(NoTls).await?;
        // The connection object performs the actual communication with the database,
        // so spawn it off to run on its own.
        tokio::spawn(async move {
            if let Err(e) = connection.await {
                eprintln!("connection error: {}", e);
            }
        });

        check_schema_version(&postgres).await;

        let scheduler = Self {
            postgres,
            clients,
            delete_client,
            tick_count,
            tick_delay,
            metrics_file,
        };

        for address in listen_addrs {
            scheduler.add_listener(address).await;
        }

        Ok(scheduler)
    }

    pub async fn add_listener(&self, address: ListenAddr) {
        let clients = Arc::clone(&self.clients);
        tokio::spawn(async move {
            let listener = match address {
                ListenAddr::TCP(addr) => TcpListener::bind(addr).await.unwrap(),
                ListenAddr::Unix(path) => todo!("Unix listeners not implemented"),
            };
            println!("Listening on {:?}", listener.local_addr().unwrap());

            while let Ok((socket, addr)) = listener.accept().await {
                println!("Connection from {:?}", addr);
                {
                    let mut client_lock = clients.write().await;
                    client_lock.insert(addr, socket);
                }
            }
        });
    }

    async fn do_tick_loop(&self) -> GenericResult<()> {
        let mut end_of_tick = Instant::now() + self.tick_delay;
        loop {
            let mut stream_finished = false;
            let row_stream = select_statuses(&self.postgres).await?;
            pin_mut!(row_stream);

            let client_count = Arc::clone(&self.clients).read().await.len();
            let status_count: usize = select_status_count(&self.postgres).await?.try_into()?;
            let total_output: usize = client_count.saturating_mul(self.tick_count.try_into()?);
            let est_tick_count = if client_count > 0 {
                usize::max(1, status_count / total_output)
            } else {
                1
            };

            let mut statuses_sent = 0u32;

            for tick in 0..self.tick_count {
                println!("Tick {}", tick);

                if !stream_finished {
                    let clients_lock = self.clients.read().await;
                    for (addr, socket) in clients_lock.iter() {
                        if let Err(_) = socket.writable().await {
                            // Socket is probably closed queue it for deletion
                            self.delete_client.send(*addr).await.unwrap();
                            continue;
                        }

                        println!("  Client {}", addr);
                        for _ in 0..est_tick_count {
                            if let Some(row) = row_stream.try_next().await? {
                                #[cfg(debug_assertions)]
                                println!("    {:?}", row.get::<_, String>(5));

                                let mut r = serde_json::to_vec(&row_to_json_value(&row)).unwrap();
                                r.push(b'\n');
                                statuses_sent += 1;
                                // TODO: Check what the error is
                                // TODO: Transmit tick number to clients
                                if let Err(_) = socket.try_write(&r) {
                                    self.delete_client.send(*addr).await.unwrap();
                                    break;
                                }
                            } else {
                                stream_finished = true;
                                break;
                            }
                        }
                        if stream_finished {
                            break;
                        }
                    }
                }

                tokio::time::sleep_until(end_of_tick).await;
                end_of_tick = Instant::now() + self.tick_delay;
            }

            #[cfg(feature = "metrics")]
            {
                if let Some(file) = &self.metrics_file {
                    let metrics = Metrics {
                        client_count: client_count as u32,
                        tick_count: self.tick_count,
                        status_count: status_count as u32,
                        status_sent_count: statuses_sent,
                        status_remaining_count: row_stream.size_hint(),
                    };
                    let file = file.clone();
                    tokio::spawn(async move {
                        metrics.write_to_file(file).await.unwrap();
                    });
                }
            }
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Parse DB config
    let mut pg_config = tokio_postgres::config::Config::new();
    pg_config.user(
        &get_var("PGUSER")
            .or_else(|_| get_var("PG_USER"))
            .or_else(|_| get_var("USER"))
            .expect("A database username must be provided"),
    );
    if let Ok(db) = get_var("PGDATABASE").or_else(|_| get_var("PG_DATABASE")) {
        pg_config.dbname(&db);
    }
    if let Ok(host) = get_var("PGHOST").or_else(|_| get_var("PG_HOST")) {
        pg_config.host(&host);
    } else {
        pg_config.host("127.0.0.1");
    }
    if let Ok(password) = get_var("PGPASSWORD").or_else(|_| get_var("PG_PASSWORD")) {
        pg_config.password(&password);
    }

    // Parse tick config
    let tick_count = if let Ok(tick_count) = get_var("GS_TICK_COUNT") {
        u32::from_str_radix(&tick_count, 10).unwrap_or(DEFAULT_TICK_COUNT)
    } else {
        DEFAULT_TICK_COUNT
    };

    let tick_delay = if let Some(tick_delay) = get_var("GS_TICK_TIME")
        .ok()
        .as_ref()
        .and_then(|t| u64::from_str_radix(t, 10).ok())
    {
        Duration::from_millis(tick_delay)
    } else {
        DEFAULT_TICK_TIME
    };

    let metrics_file = get_var("GS_METRICS_FILE").ok();

    // Parse listen config
    let mut listen_addrs: Vec<ListenAddr> = std::env::args()
        .skip(1)
        .map(|a| {
            if let Some((proto, uri)) = a.split_once("://") {
                match proto {
                    "tcp" => {
                        ListenAddr::TCP(SocketAddr::from_str(uri).expect("Invalid listen address"))
                    }
                    "unix" => ListenAddr::Unix(PathBuf::from(uri)),
                    _ => panic!("Unknown listen protocol {:?}", proto),
                }
            } else {
                ListenAddr::TCP(SocketAddr::from_str(&a).expect("Invalid listen address"))
            }
        })
        .collect();

    if listen_addrs.len() == 0 {
        listen_addrs.push(ListenAddr::TCP(SocketAddr::V4(SocketAddrV4::new(
            Ipv4Addr::new(127, 0, 0, 1),
            1337,
        ))));
    }

    let scheduler = Scheduler::initialize(
        pg_config,
        tick_count,
        tick_delay,
        metrics_file,
        listen_addrs,
    )
    .await?;
    scheduler.do_tick_loop().await?;

    Ok(())
}
