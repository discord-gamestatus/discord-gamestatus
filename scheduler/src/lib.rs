use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use futures_util::{pin_mut, Stream, TryStreamExt};
use tokio::io::AsyncReadExt;
use tokio::net::TcpListener;
use tokio::select;
use tokio::sync::mpsc::Sender;
use tokio::sync::RwLock;
use tokio::time::Instant;
use tokio_postgres::NoTls;
use tokio_util::sync::CancellationToken;

mod constants;
pub mod database;
#[cfg(feature = "metrics")]
pub mod metrics;
mod types;

pub use constants::*;
pub use types::*;

use database::{check_schema_version, row_to_json_value, select_status_count, select_statuses};
#[cfg(feature = "metrics")]
use metrics::Metrics;

pub struct Scheduler {
    postgres: PGClient,
    clients: ConnectedClients,
    delete_client: tokio::sync::mpsc::Sender<SocketAddr>,

    metrics_file: Option<String>,
    tick_count: u32,
    tick_delay: Duration,
    max_per_tick: usize,
    debug: bool,
}

impl Scheduler {
    pub async fn initialize(
        pg_config: tokio_postgres::Config,
        tick_count: u32,
        tick_delay: Duration,
        max_per_tick: usize,
        metrics_file: Option<String>,
        listen_addrs: Vec<ListenAddr>,
        debug: bool,
    ) -> PGResult<Self> {
        let clients: ConnectedClients = Arc::new(RwLock::new(HashMap::new()));
        let (delete_client, mut del_rx) = tokio::sync::mpsc::channel(128);

        let del_clients = Arc::clone(&clients);
        tokio::spawn(async move {
            while let Some(task) = del_rx.recv().await {
                println!("[Client] Disconnected from: {:?}", task);
                // TODO: Update some global that keeps track of number of updates per tick
                let client = del_clients.write().await.remove(&task);
                if let Some((_, cancel_read)) = client {
                    cancel_read.cancel();
                }
            }
        });

        let (postgres, connection) = pg_config.clone().connect(NoTls).await?;
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
            max_per_tick,
            metrics_file,
            debug,
        };

        let (handle_response, mut response_rx) = tokio::sync::mpsc::channel(128);

        tokio::spawn(async move {
            let (postgres, connection) = pg_config.connect(NoTls).await.unwrap();
            // The connection object performs the actual communication with the database,
            // so spawn it off to run on its own.
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            while let Some(response) = response_rx.recv().await {
                match &response {
                    ClientResult::Sent {
                        message_id,
                        status_id,
                    } => {
                        println!("Updating message for {} to {}", status_id, message_id);
                        database::update_status_message_id(
                            &postgres,
                            status_id,
                            message_id.as_str(),
                        )
                        .await
                        .unwrap();
                    }
                    _ => {
                        println!("Client error {:?}", response);
                    }
                }
            }
        });

        for address in listen_addrs {
            scheduler
                .add_listener(address, handle_response.clone())
                .await;
        }

        Ok(scheduler)
    }

    pub async fn add_listener(&self, address: ListenAddr, handle_response: Sender<ClientResult>) {
        let clients = Arc::clone(&self.clients);
        tokio::spawn(async move {
            let listener = match address {
                ListenAddr::TCP(addr) => TcpListener::bind(addr).await.unwrap(),
                ListenAddr::Unix(_path) => todo!("Unix listeners not implemented"),
            };
            println!("Listening on {:?}", listener.local_addr().unwrap());

            while let Ok((socket, addr)) = listener.accept().await {
                println!("[Client] Connection from {:?}", addr);
                let (read_half, write_half) = socket.into_split();
                let read_check_cancel = CancellationToken::new();
                let read_canceller = read_check_cancel.clone();

                tokio::spawn(Self::client_reader(
                    handle_response.clone(),
                    read_half,
                    read_check_cancel,
                ));
                clients
                    .write()
                    .await
                    .insert(addr, (write_half, read_canceller));
                println!("test");
            }
        });
    }

    async fn client_reader(
        handle_response: Sender<ClientResult>,
        mut reader: tokio::net::tcp::OwnedReadHalf,
        canceller: CancellationToken,
    ) {
        let mut buf = vec![0; 1024];
        println!("Spawning read loop");
        loop {
            let size = select! {
                read = reader.read(&mut buf) => {
                    read.ok()
                }
                _ = canceller.cancelled() => {
                    None
                }
            };
            if let Some(size) = size {
                let data: Result<ClientResult, _> = serde_json::from_slice(&buf[..size]);
                println!("Client response: {:?}", data);
                handle_response.send(data.unwrap()).await.unwrap();
            } else {
                println!("Either cancelled or error");
                break;
            }
        }
    }

    pub async fn do_tick_loop(&self) -> GenericResult<()> {
        if self.debug {
            println!("Starting tick loop...");
        }
        let mut end_of_tick = Instant::now() + self.tick_delay;
        loop {
            let mut stream_finished = false;

            let status_count: usize = select_status_count(&self.postgres).await?.try_into()?;

            let row_stream = select_statuses(&self.postgres).await?;
            pin_mut!(row_stream);

            if self.debug {
                println!("Start of tick loop status_count={}", status_count);
            }

            let mut statuses_sent = 0usize;

            for tick in 0..self.tick_count {
                let client_count = self.client_count().await;

                if client_count == 0 {
                    tokio::time::sleep_until(end_of_tick).await;
                    end_of_tick = Instant::now() + self.tick_delay;
                    break;
                }

                let output_left = client_count.saturating_mul((self.tick_count - tick).try_into()?);
                let statuses_left = status_count.saturating_sub(statuses_sent);
                let est_tick_count = if output_left > 0 {
                    usize::min(
                        self.max_per_tick,
                        usize::max(1, statuses_left / output_left),
                    )
                } else {
                    0
                };

                if self.debug {
                    println!(
                        "Tick {} output_left={} statuses_left={} tick_size={}",
                        tick, output_left, statuses_left, est_tick_count
                    );
                }

                if !stream_finished {
                    let clients_lock = self.clients.read().await;
                    for (addr, (socket, _)) in clients_lock.iter() {
                        if socket.writable().await.is_err() {
                            // Socket is probably closed queue it for deletion
                            self.delete_client.send(*addr).await.unwrap();
                            continue;
                        }

                        if self.debug {
                            println!("  Client {}", addr);
                        }
                        for _ in 0..est_tick_count {
                            if let Some(row) = row_stream.try_next().await? {
                                if self.debug {
                                    println!("    {:?}", row.get::<_, String>(5));
                                }

                                let mut r = serde_json::to_vec(&row_to_json_value(&row)).unwrap();
                                r.push(b'\n');
                                // TODO: Check what the error is
                                // TODO: Transmit tick number to clients
                                if socket.try_write(&r).is_err() {
                                    self.delete_client.send(*addr).await.unwrap();
                                    break;
                                }

                                statuses_sent += 1;
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
                    let client_count = self.client_count().await;
                    let metrics = Metrics {
                        client_count,
                        tick_count: self.tick_count,
                        max_per_tick: self.max_per_tick,
                        status_count,
                        status_sent_count: statuses_sent,
                        status_remaining_count: row_stream.size_hint(),
                        status_capacity: self.tick_count.try_into().unwrap_or(0)
                            * self.max_per_tick
                            * client_count,
                    };
                    let file = file.clone();
                    tokio::spawn(async move {
                        metrics.write_to_file(file).await.unwrap();
                    });
                    if self.debug {
                        println!("[Metrics] writing to {:?}", self.metrics_file);
                    }
                }
            }
        }
    }

    pub async fn client_count(&self) -> usize {
        self.clients.read().await.len()
    }
}
