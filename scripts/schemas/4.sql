CREATE OR REPLACE VIEW schema_version AS SELECT 4 AS version;

CREATE VIEW status_counts_per_server AS SELECT
  array_agg(id) AS ids, count(id) AS count, guild_id
FROM statuses GROUP BY guild_id;

CREATE VIEW status_counts_per_server_with_activation AS SELECT
  ids, count, sta.guild_id, user_id
FROM
  status_counts_per_server sta
LEFT OUTER JOIN activated_guilds act ON sta.guild_id = act.guild_id;

ALTER TABLE statuses DROP CONSTRAINT statuses_guild_id_channel_id_ip_key;
ALTER TABLE statuses ADD CONSTRAINT unique_status UNIQUE(guild_id, ip);

SET track_counts = true;
