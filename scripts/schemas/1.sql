CREATE OR REPLACE VIEW schema_version AS SELECT 1 AS version;

CREATE TABLE statuses (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(128),
  channel_id VARCHAR(128),
  message_id VARCHAR(128) UNIQUE,
  type VARCHAR(32),
  ip VARCHAR(128),
  name VARCHAR(1024),
  state jsonb,
  dots text[],
  title VARCHAR(256),
  offline_title VARCHAR(256),
  description VARCHAR(2048),
  offline_description VARCHAR(2048),
  color INT CHECK (
    (color >= 0 AND color <= CAST(x'FFFFFF' AS INT)) OR color IS NULL
  ),
  offline_color INT CHECK (
    (
      offline_color >= 0 AND offline_color <= CAST(x'FFFFFF' AS INT)
    ) OR offline_color IS NULL
  ),
  image VARCHAR(300),
  offline_image VARCHAR(300),
  columns INT CHECK ((columns >= 0 AND columns <= 6) OR columns IS NULL),
  max_edits INT CHECK (max_edits > 0 OR max_edits IS NULL),
  connect_update BOOLEAN,
  disconnect_update BOOLEAN,
  UNIQUE(guild_id, channel_id, ip)
);
