use std::env::var as get_var;
use std::net::{Ipv4Addr, SocketAddrV4};
use std::path::PathBuf;
use std::str::FromStr;
use std::time::Duration;

use gamestatus_scheduler::*;

#[tokio::main]
async fn main() -> GenericResult<()> {
    // Parse DB config
    let mut pg_config = tokio_postgres::config::Config::new();
    pg_config.connect_timeout(Duration::from_secs(15));
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

    // Parse arguments
    let mut debug = false;
    let mut listen_addrs: Vec<ListenAddr> = std::env::args()
        .skip(1)
        .filter_map(|a| {
            match a.as_str() {
                "--debug" => {
                    debug = true;
                    return None;
                }
                "--help" => todo!("Add help"),
                _ => {}
            };

            if let Some((proto, uri)) = a.split_once("://") {
                Some(match proto {
                    "tcp" => {
                        ListenAddr::TCP(SocketAddr::from_str(uri).expect("Invalid listen address"))
                    }
                    "unix" => ListenAddr::Unix(PathBuf::from(uri)),
                    _ => panic!("Unknown listen protocol {:?}", proto),
                })
            } else {
                if let Ok(addr) = SocketAddr::from_str(&a) {
                    Some(ListenAddr::TCP(addr))
                } else {
                    None
                }
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
        debug,
    )
    .await?;
    scheduler.do_tick_loop().await?;

    Ok(())
}
