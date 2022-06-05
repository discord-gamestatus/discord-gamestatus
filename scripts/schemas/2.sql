CREATE TABLE IF NOT EXISTS activated_guilds (
  guild_id VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL
);
