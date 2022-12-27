CREATE OR REPLACE VIEW schema_version AS SELECT 2 AS version;

CREATE TABLE IF NOT EXISTS activated_guilds (
  guild_id VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL
);
