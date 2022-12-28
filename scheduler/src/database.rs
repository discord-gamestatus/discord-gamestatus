use std::collections::HashMap;

use tokio::sync::OnceCell;

use super::constants::REQUIRED_SCHEMA_VERSION;
use super::types::*;

static SELECT_STATUS_COUNT_QUERY: OnceCell<tokio_postgres::Statement> = OnceCell::const_new();
// Get the number of statuses currently in the database
pub async fn select_status_count(client: &PGClient) -> PGResult<i64> {
    let query = SELECT_STATUS_COUNT_QUERY
        .get_or_try_init(|| async { client.prepare("SELECT COUNT(*) FROM statuses").await })
        .await?;

    let result = client.query_one(query, &[]).await?;
    result.try_get(0)
}

static SELECT_STATUSES_QUERY: OnceCell<tokio_postgres::Statement> = OnceCell::const_new();
// Fetch a stream of all statuses in the database
pub async fn select_statuses(client: &PGClient) -> PGResult<tokio_postgres::RowStream> {
    let query = SELECT_STATUSES_QUERY
        .get_or_try_init(|| async { client.prepare("SELECT * FROM statuses").await })
        .await?;

    let params: Vec<String> = vec![];
    client.query_raw(query, params).await
}

pub fn row_get_or_null<'a, T: tokio_postgres::types::FromSql<'a> + serde::ser::Serialize>(
    row: &'a tokio_postgres::Row,
    idx: usize,
) -> JValue {
    if let Ok(v) = row.try_get::<_, T>(idx) {
        serde_json::json!(v)
    } else {
        JValue::Null
    }
}

pub fn row_to_json_value<'a>(row: &'a tokio_postgres::Row) -> HashMap<&'a str, serde_json::Value> {
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

pub async fn check_schema_version(client: &PGClient) {
    if let Ok(version) = client
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
}
