#![cfg(feature = "metrics")]

use lazy_static::lazy_static;
use prometheus::{self, register_counter, register_int_gauge, Counter, IntGauge, TextEncoder};
use tokio::io::AsyncWriteExt;

use super::types::*;

lazy_static! {
    static ref GAUGE_CLIENT_COUNT: IntGauge =
        register_int_gauge!("clients", "Number of clients connected").unwrap();
    static ref GAUGE_TICK_COUNT: IntGauge =
        register_int_gauge!("ticks", "Number of ticks").unwrap();
    static ref GAUGE_STATUS_COUNT: IntGauge =
        register_int_gauge!("statuses", "Number of statuses in the database").unwrap();
    static ref GAUGE_STATUS_SENT_COUNT: IntGauge =
        register_int_gauge!("sent", "Number of statuses sent in the last tick cycle").unwrap();
    static ref GAUGE_STATUS_REMAINING_COUNT: IntGauge =
        register_int_gauge!("remaining", "Estimated number of statuses remaining").unwrap();
    static ref GAUGE_STATUS_REMAINING_COUNT_MIN: IntGauge =
        register_int_gauge!("remaining_min", "Minimum number of statuses remaining").unwrap();
    static ref GAUGE_STATUS_REMAINING_COUNT_MAX: IntGauge =
        register_int_gauge!("remaining_max", "Maximum number of statuses remaining").unwrap();
    static ref COUNTER_TICK: Counter =
        register_counter!("tick", "The current tick number").unwrap();
}

pub struct Metrics {
    pub client_count: u32,
    pub tick_count: u32,
    pub status_count: u32,
    pub status_sent_count: u32,
    pub status_remaining_count: (usize, Option<usize>),
}

pub fn encode() -> prometheus::Result<String> {
    let encoder = TextEncoder::new();

    let metrics = prometheus::gather();

    encoder.encode_to_string(&metrics)
}

impl Metrics {
    pub fn update_metrics(&self) {
        COUNTER_TICK.inc();
        GAUGE_CLIENT_COUNT.set(self.client_count.into());
        GAUGE_TICK_COUNT.set(self.tick_count.into());
        GAUGE_STATUS_COUNT.set(self.status_count.into());
        GAUGE_STATUS_SENT_COUNT.set(self.status_sent_count.into());
        GAUGE_STATUS_REMAINING_COUNT.set((self.status_count - self.status_sent_count).into());
        GAUGE_STATUS_REMAINING_COUNT_MIN.set(self.status_remaining_count.0 as i64);
        GAUGE_STATUS_REMAINING_COUNT_MAX.set(
            self.status_remaining_count
                .1
                .map(|n| n as i64)
                .unwrap_or(-1),
        );
    }

    pub async fn write_to_file(&self, file: impl AsRef<std::path::Path>) -> GenericResult<()> {
        // FIXME: The static here is a bit weird
        self.update_metrics();
        let content = encode()?;
        let mut file = tokio::fs::OpenOptions::new()
            .create(true)
            .write(true)
            .open(file.as_ref())
            .await?;
        file.write_all(&content.into_bytes()).await?;

        println!("Wrote metrics");
        Ok(())
    }
}
