/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2021-2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { Pool, QueryResult, QueryResultRow } from "pg";
import { Snowflake } from "discord.js-light";

import SaveInterface, {
  GetOpts,
  DeleteOpts,
  eitherSelector,
  Selector,
} from "./SaveInterface";
import Update from "../Update";
import { errorLog } from "../../debug";
import { REQUIRED_SCHEMA_VERSION } from "../../constants";
import { throwForSchemaVersion } from "../../utils";

export default class SavePSQL implements SaveInterface {
  private pool: Pool;

  constructor(database?: string) {
    this.pool = new Pool({ database: database || "discord_gamestatus" });
  }

  /*****************************************************************************
   *** Interface funcs
   *****************************************************************************/

  async load(): Promise<void> {
    // Check schema version
    throwForSchemaVersion(this.pool, REQUIRED_SCHEMA_VERSION);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async get(opts: GetOpts): Promise<Update[]> {
    let key, value;
    if (opts.message !== undefined) {
      key = "message_id";
      value = opts.message;
    } else if (opts.channel !== undefined) {
      key = "channel_id";
      value = opts.channel;
    } else if (opts.guild !== undefined) {
      key = "guild_id";
      value = opts.guild;
    } else {
      throw new Error("Must specify a search param when getting statuses");
    }

    const client = await this.pool.connect();
    // FIXME: Make this a non-template string: this is bad as it is injectable.
    // Should be fine for now as key can only be one of the 3 above values
    // but if there is some kind of other injection this would be exploitable
    const query = await client.query(
      `SELECT guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update FROM statuses WHERE ${key}=$1`,
      [value]
    );
    client.release();

    return query.rows.map((item) => SavePSQL.rowToUpdate(item));
  }

  async create(status: Update): Promise<boolean> {
    let success = true;

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO statuses \
          (guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description,\
          color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update) VALUES \
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)",
        [
          status.guild,
          status.channel,
          status.message,
          status.type,
          status.ip,
          status.name,
          JSON.stringify(status.state),
          status.options?.dots,
          status.options?.title,
          status.options?.offlineTitle,
          status.options?.description,
          status.options?.offlineDescription,
          status.options?.color,
          status.options?.offlineColor,
          status.options?.image,
          status.options?.offlineImage,
          status.options?.columns,
          status.options?.maxEdits,
          status.options?.connectUpdate,
          status.options?.disconnectUpdate,
        ]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      errorLog(e);
      success = false;
    } finally {
      client.release();
    }
    return success;
  }

  async update(status: Update): Promise<boolean> {
    let success = true;

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const r = await client.query(
        "UPDATE statuses SET\
          message_id=$4, type=$5, name=$6, state=$7, dots=$8, title=$9, offline_title=$10, description=$11, offline_description=$12,\
          color=$13, offline_color=$14, image=$15, offline_image=$16, columns=$17, max_edits=$18, connect_update=$19, disconnect_update=$20\
          WHERE guild_id=$1 AND channel_id=$2 and ip=$3",
        [
          status.guild,
          status.channel,
          status.ip,
          status.message,
          status.type,
          status.name,
          JSON.stringify(status.state),
          status.options?.dots,
          status.options?.title,
          status.options?.offlineTitle,
          status.options?.description,
          status.options?.offlineDescription,
          status.options?.color,
          status.options?.offlineColor,
          status.options?.image,
          status.options?.offlineImage,
          status.options?.columns,
          status.options?.maxEdits,
          status.options?.connectUpdate,
          status.options?.disconnectUpdate,
        ]
      );
      if (r.rowCount !== 1)
        throw new Error(
          `Invalid amount (${r.rowCount}) of statuses were updated`
        );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      errorLog(e);
      success = false;
    } finally {
      client.release();
    }
    return success;
  }

  async delete(opts: DeleteOpts): Promise<number> {
    let success = true;
    let result: QueryResult | undefined = undefined;

    if (opts.guild === undefined || opts.channel === undefined) {
      throw new Error("Must specify search params when deleting statuses");
    }

    let selector: Selector | undefined = undefined;
    if (opts instanceof Update || "ip" in opts || "message" in opts) {
      selector = eitherSelector(opts);
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      if (selector !== undefined) {
        result = await client.query(
          `DELETE FROM statuses WHERE guild_id=$1 AND channel_id=$2 AND ${selector.key}=$3`,
          [opts.guild, opts.channel, selector.value]
        );
      } else {
        result = await client.query(
          `DELETE FROM statuses WHERE guild_id=$1 AND channel_id=$2`,
          [opts.guild, opts.channel]
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      errorLog(e);
      success = false;
    } finally {
      client.release();
    }
    return success && result ? result.rowCount : -1;
  }

  async has(status: Update): Promise<boolean> {
    if (status.guild === undefined || status.channel === undefined) {
      throw new Error("Must specify search params when querying statuses");
    }
    const selector = eitherSelector(status);
    const client = await this.pool.connect();
    const query = await client.query(
      `SELECT 1 FROM statuses WHERE guild_id=$1 AND channel_id=$2 AND ${selector.key}=$4 LIMIT 1`,
      [status.guild, status.channel, selector.value]
    );
    client.release();
    return query.rows.length > 0;
  }

  async values(): Promise<Update[][]> {
    const all = await this.getAll();
    return Object.values(all);
  }

  async entries(): Promise<[string, Update[]][]> {
    const all = await this.getAll();
    return Object.entries(all);
  }

  async getGuildActivation(guild: Snowflake): Promise<Snowflake | undefined> {
    const client = await this.pool.connect();
    const query = await client.query(
      "SELECT user_id FROM activated_guilds WHERE guild_id=$1 LIMIT 1",
      [guild]
    );
    client.release();
    return query.rowCount === 0 ? undefined : query.rows[0].user_id;
  }

  async getUserActivationCount(user: Snowflake): Promise<number> {
    const client = await this.pool.connect();
    const query = await client.query(
      "SELECT COUNT(guild_id) AS count FROM activated_guilds WHERE user_id=$1",
      [user]
    );
    client.release();
    return query.rowCount === 0 ? 0 : query.rows[0].count;
  }

  async addUserActivation(user: Snowflake, guild: Snowflake): Promise<boolean> {
    let didError = false;
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO activated_guilds (guild_id, user_id) VALUES ($1, $2)",
        [guild, user]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      didError = true;
    } finally {
      client.release();
    }
    return !didError;
  }

  async removeUserActivation(guild: Snowflake): Promise<boolean> {
    let didError = false;
    let r = { rowCount: 0 };
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      r = await client.query("DELETE FROM activated_guilds WHERE guild_id=$1", [
        guild,
      ]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      didError = true;
    } finally {
      client.release();
    }
    return !didError && r.rowCount > 0;
  }

  /*****************************************************************************
   *** Helpers
   *****************************************************************************/

  async getAll(): Promise<{ [id: string]: Update[] }> {
    const client = await this.pool.connect();
    const query = await client.query(
      "SELECT guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update FROM statuses"
    );
    client.release();

    const res: { [id: string]: Update[] } = {};

    query.rows.forEach((item) => {
      let channel: Update[] = [];
      if (item.channel in res) {
        channel = res[item.channel];
      }
      channel.push(SavePSQL.rowToUpdate(item));
      res[item.channel] = channel;
    });

    return res;
  }

  static rowToUpdate(row: QueryResultRow): Update {
    return Update.parse({
      guild: row.guild_id,
      channel: row.channel_id,
      message: row.message_id,
      type: row.type,
      ip: row.ip,
      name: row.name,
      state: row.state,
      options: {
        dots: row.dots,
        title: row.title,
        offlineTitle: row.offline_title,
        description: row.description,
        offlineDescription: row.offline_description,
        color: row.color,
        offlineColor: row.offline_color,
        image: row.image,
        offlineImage: row.offline_image,
        columns: row.columns,
        maxEdits: row.max_edits,
        connectUpdate: row.connect_update,
        disconnectUpdate: row.disconnect_update,
      },
    }) as Update;
  }
}
