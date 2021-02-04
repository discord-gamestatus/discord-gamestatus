/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2021 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { Pool } = require('pg')

const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');

function fixStrings(values) {
  return values.map(v => {
    if (v instanceof String) return v.toString();
    return v;
  })
}

class SavePSQL extends SaveInterface {
  constructor(database) {
    super();
    this.pool = new Pool({ database: database || 'discord_gamestatus' });
  }

  /*****************************************************************************
  *** Interface funcs
  *****************************************************************************/

  async load() {

  }

  async close() {
    await this.pool.end();
  }

  async get(key) {
    const client = await this.pool.connect();
    const query = await client.query('SELECT guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update FROM statuses WHERE channel_id=$1::text', [key]);
    client.release();

    return query.rows.map(item => SavePSQL.rowToUpdate(item));
  }

  async set(key, value) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM statuses WHERE channel_id=$1', [key]); // Because of JSON indexing have to delete all updates first
      for (let status of value) {
        await client.query('INSERT INTO statuses (guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) ON CONFLICT ON CONSTRAINT statuses_guild_id_channel_id_ip_key DO UPDATE SET message_id=$3, type=$4, name=$6, state=$7, dots=$8, title=$9, offline_title=$10, description=$11, offline_description=$12, color=$13, offline_color=$14, image=$15, offline_image=$16, columns=$17, max_edits=$18, connect_update=$19, disconnect_update=$20', fixStrings([
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
        ]));
      }
      await client.query('COMMIT');
    } catch(e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async delete(key) {
    const client = await this.pool.connect();
    await client.query('DELETE FROM statuses WHERE channel_id=$1::text', [key]);
    client.release();
  }

  async has(key) {
    const client = await this.pool.connect();
    const query = await client.query('SELECT 1 FROM statuses WHERE channel_id=$1::text LIMIT 1', [key]);
    client.release();
    return query.rows.length > 0;
  }

  async values() {
    const all = await this.getAll();
    return Object.values(all);
  }

  async entries() {
    const all = await this.getAll();
    return Object.entries(all);
  }

  /*****************************************************************************
  *** Helpers
  *****************************************************************************/

  async getAll() {
    const client = await this.pool.connect();
    const query = await client.query('SELECT guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update FROM statuses');
    client.release();

    const res = {};

    query.rows.forEach(item => {
      let channel = [];
      if (item.channel in res) {
        channel = res[item.channel];
      }
      channel.push(SavePSQL.rowToUpdate(item));
      res[item.channel] = channel;
    });

    return res;
  }

  static rowToUpdate(row) {
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
    });
  }
}

module.exports = SavePSQL;
