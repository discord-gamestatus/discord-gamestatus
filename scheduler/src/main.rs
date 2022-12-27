use std::collections::HashMap;
use std::env::var as get_var;
use std::net::{Ipv4Addr, SocketAddr, SocketAddrV4};
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;

use futures_util::{pin_mut, TryStreamExt};
use tokio::net::TcpListener;
use tokio::sync::{OnceCell, RwLock};
use tokio_postgres::NoTls;

type PGClient = tokio_postgres::Client;
type PGType = tokio_postgres::types::Type;
type PGError = tokio_postgres::Error;
type PGResult<T> = Result<T, PGError>;

type JValue = serde_json::Value;

type ConnectedClients = Arc<RwLock<HashMap<SocketAddr, tokio::net::TcpStream>>>;

const REQUIRED_SCHEMA_VERSION: i32 = 4;

static SELECT_STATUS_COUNT_QUERY: OnceCell<tokio_postgres::Statement> = OnceCell::const_new();
async fn select_status_count(client: &PGClient) -> PGResult<i64> {
    let query = SELECT_STATUS_COUNT_QUERY
        .get_or_try_init(|| async { client.prepare("SELECT COUNT(*) FROM statuses").await })
        .await?;

    let result = client.query_one(query, &[]).await?;
    result.try_get(0)
}

static SELECT_STATUSES_QUERY: OnceCell<tokio_postgres::Statement> = OnceCell::const_new();
async fn select_statuses(client: &PGClient) -> PGResult<tokio_postgres::RowStream> {
    let query = SELECT_STATUSES_QUERY
        .get_or_try_init(|| async { client.prepare("SELECT * FROM statuses").await })
        .await?;

    let params: Vec<String> = vec![];
    client.query_raw(query, params).await
}

fn row_get_or_null<'a, T: tokio_postgres::types::FromSql<'a> + serde::ser::Serialize>(
    row: &'a tokio_postgres::Row,
    idx: usize,
) -> JValue {
    if let Ok(v) = row.try_get::<_, T>(idx) {
        serde_json::json!(v)
    } else {
        JValue::Null
    }
}

fn row_to_json_value<'a>(row: &'a tokio_postgres::Row) -> HashMap<&'a str, serde_json::Value> {
    let mut r = HashMap::new();

    for (idx, column) in row.columns().iter().enumerate() {
        r.insert(
            column.name(),
            match column.type_() {
                &PGType::INT4 => row_get_or_null::<i32>(row, idx),
                &PGType::VARCHAR => row_get_or_null::<String>(row, idx),
                &PGType::JSONB => row_get_or_null::<JValue>(row, idx),
                &PGType::BOOL => row_get_or_null::<bool>(row, idx),
                // TODO: Add parsing for dots array
                _ => JValue::Null,
            },
        );
    }

    r
}

async fn run_ticks(
    pg: &PGClient,
    row_stream: tokio_postgres::RowStream,
    clients: &ConnectedClients,
    delete_client: &tokio::sync::mpsc::Sender<SocketAddr>,
    n_ticks: u32,
    tick_delay: Duration,
) -> PGResult<()> {
    let n_clients = Arc::clone(clients).read().await.len() as u32;
    let status_count = select_status_count(pg).await? as u32;
    let total_output = n_ticks * n_clients;
    let est_tick_count = if n_clients > 0 {
        u32::max(1, status_count / total_output)
    } else {
        1
    };

    let mut stream_finished = false;

    pin_mut!(row_stream);

    for tick in 0..n_ticks {
        #[cfg(debug_assertions)]
        println!("Tick {}", tick);
        if !stream_finished {
            let clients_lock = clients.read().await;
            for (addr, socket) in clients_lock.iter() {
                if let Err(_) = socket.writable().await {
                    // Socket is probably closed queue it for deletion
                    delete_client.send(*addr).await.unwrap();
                    continue;
                }

                #[cfg(debug_assertions)]
                println!("  Client {}", addr);
                for _ in 0..est_tick_count {
                    if let Some(row) = row_stream.try_next().await? {
                        #[cfg(debug_assertions)]
                        println!("    {:?}", row.get::<_, String>(5));

                        let mut r = serde_json::to_vec(&row_to_json_value(&row)).unwrap();
                        r.push(b'\n');
                        // TODO: Check what the error is
                        // TODO: Transmit tick number to clients
                        if let Err(_) = socket.try_write(&r) {
                            delete_client.send(*addr).await.unwrap();
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

        tokio::time::sleep(tick_delay).await;
    }

    Ok(())
}

enum ListenAddr {
    TCP(SocketAddr),
    Unix(PathBuf),
}

const DEFAULT_TICK_COUNT: u32 = 60;

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

    // Connect to the database.
    let (pg, connection) = pg_config.connect(NoTls).await?;

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // Check schema version
    if let Ok(version) = pg
        .query_one("SELECT version FROM schema_version", &[])
        .await
    {
        let version: i32 = version.get(0);
        if version < REQUIRED_SCHEMA_VERSION {
            panic!(
                "Database version {:?} is lower than the required version {:?}",
                version, REQUIRED_SCHEMA_VERSION
            );
        }
    } else {
        panic!(
            "Could not check database schema version, check that the database is setup properly"
        );
    }

    let clients = Arc::new(RwLock::new(HashMap::new()));

    // Start listeners
    for listen_addr in listen_addrs {
        let clients = Arc::clone(&clients);
        tokio::spawn(async move {
            let listener = match listen_addr {
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

    let (del_tx, mut del_rx) = tokio::sync::mpsc::channel(128);
    let del_clients = Arc::clone(&clients);
    tokio::spawn(async move {
        while let Some(task) = del_rx.recv().await {
            println!("Deleting {:?}", task);
            del_clients.write().await.remove(&task);
        }
    });

    loop {
        let row_stream = select_statuses(&pg).await?;
        run_ticks(
            &pg,
            row_stream,
            &clients,
            &del_tx,
            tick_count,
            Duration::from_secs(1),
        )
        .await?;
    }
}
