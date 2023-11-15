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

pub type ConnectedClients = Arc<
    RwLock<
        HashMap<
            SocketAddr,
            (
                tokio::net::tcp::OwnedWriteHalf,
                tokio_util::sync::CancellationToken,
            ),
        >,
    >,
>;

pub type GenericResult<T> = Result<T, Box<dyn std::error::Error>>;

pub enum ListenAddr {
    TCP(SocketAddr),
    Unix(PathBuf),
}

#[derive(Clone, Debug, serde::Deserialize)]
#[serde(tag = "state")]
pub enum ClientResult {
    #[serde(rename = "sent")]
    Sent { message_id: String, status_id: i32 },
    #[serde(rename = "error")]
    Error { code: u32, message: String },
}
