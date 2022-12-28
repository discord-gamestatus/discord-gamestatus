use std::collections::HashMap;
pub use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;

use tokio::sync::RwLock;

pub use tokio::fs::File;

pub type PGClient = tokio_postgres::Client;
pub type PGType = tokio_postgres::types::Type;
pub type PGError = tokio_postgres::Error;
pub type PGResult<T> = Result<T, PGError>;

pub type JValue = serde_json::Value;

pub type ConnectedClients = Arc<RwLock<HashMap<SocketAddr, tokio::net::TcpStream>>>;

pub type GenericResult<T> = Result<T, Box<dyn std::error::Error>>;

pub enum ListenAddr {
    TCP(SocketAddr),
    Unix(PathBuf),
}
