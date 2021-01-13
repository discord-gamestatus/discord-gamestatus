/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2020 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { Collection } = require('discord.js-light');

const { errorLog, debugLog, verboseLog } = require('../debug.js');
const SaveInterface = require('./save/SaveInterface.js');
const SaveJSON = require('./save/SaveJSON.js');
let SavePSQL;
try {
  SavePSQL = require('./save/SavePSQL.js');
} catch(e) {
  verboseLog(e);
}
const Update = require('./Update.js');
const { getLimits } = require('../limits.js');
const { asyncArray } = require('../utils.js');

class UpdateCache {
  constructor(opts) {
    this._locks = new Map();
    this.saveInterface = new SaveInterface();
    if (opts.database && SavePSQL) {
      this.saveInterface = new SavePSQL(opts.database);
    } else if (opts.filename) {
      this.saveInterface = new SaveJSON(opts.filename);
    } else {
      this.saveInterface = new SaveJSON();
    }
  }

  async load() {
    await this.saveInterface.load();
  }

  get(key) {
    return this.saveInterface.get(key);
  }

  set(key, value) {
    return this.saveInterface.set(key, value);
  }

  delete(key) {
    return this.saveInterface.delete(key);
  }

  values() {
    return this.saveInterface.values();
  }

  entries() {
    return this.saveInterface.entries();
  }

  async deleteEmpty() {
    for (let entry of await this.entries()) {
      if (Array.isArray(entry[1]) && entry[1].length === 0) {
        await this.delete(entry[0]);
        debugLog(`Encountered empty channel ${entry[0]}`);
      }
    }
  }

  close() {
    return this.saveInterface.close();
  }

  /*****************************************************************************
  *** Abstracted update functions
  *****************************************************************************/

  async _lock(key) {
    if (this._locks.has(key)) {
      const queue = this._locks.get(key);
      const locks = this._locks;
      await new Promise((resolve) => {
        locks.set(key, queue.concat([resolve]));
      });
    } else {
      this._locks.set(key, []);
    }
  }

  _unlock(key) {
    if (this._locks.has(key)) {
      const queue = this._locks.get(key);
      if (queue.length > 0) {
        const promise = queue.splice(0, 1);
        this._locks.set(key, queue);
        promise();
      } else {
        this._locks.delete(key);
      }
    }
  }

  async updateAdd(update, client) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);

    // Perform checks
    const guild = await update.getGuild(client);
    let guildUpdates = 0;
    for (let channel of guild.channels.cache.keys()) {
      if (this.has(channel)) {
        let channelUpdates = this.get(channel);
        if (!Array.isArray(channelUpdates)) channelUpdates = [channelUpdates];
        guildUpdates += channelUpdates.length;
        for (let channelUpdate of channelUpdates) {
          if (channelUpdate.ip === update.ip && !client.config.allowDuplicates) {
            return `Sorry this server already has an update using the IP \`${channelUpdate.ip}\``;
          }
        }
      }
    }

    const limits = await getLimits(client, guild.ownerID);

    // TODO: Make logic check less complex
    if ( !(isNaN(client.config.guildLimit) || client.config.guildLimit === 0 || guildUpdates < limits.guildLimit) ) {
      return `Sorry this server has reached its limit of ${client.config.guildLimit} active server statuses`;
    }

    await this._lock(update.channel);

    // TODO: Check guild limit and duplicates

    if (this.has(update.channel)) {
      let updates = await this.get(update.channel);
      if (!Array.isArray(updates)) updates = [updates];

      // Check server is allowed to add another updater
      if (isNaN(client.config.channelLimit) || client.config.channelLimit === 0 || updates.length < limits.channelLimit) {
        updates.push(update);
        await this.set(update.channel, updates);
      } else {
        await this._unlock(update.channel);
        return `Sorry this channel has reached its limit of ${client.config.channelLimit} active server statuses`;
      }
    } else {
      await this.set(update.channel, [update]);
    }

    this._unlock(update.channel);
  }

  async updateRemove(update) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);

    await this._lock(update.channel);

    update._deleted = true;

    if (this.has(update.channel)) {
      let updates = await this.get(update.channel);
      if (!Array.isArray(updates)) updates = [updates];
      const id = update.ID();
      updates = updates.filter(v => v.ID() !== id);
      if (updates.length > 0) {
        await this.set(update.channel, updates);
      } else {
        await this.delete(update.channel);
      }
    }

    this._unlock(update.channel);
  }

  async updateSave(update) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);

    const id = update.ID();

    await this._lock(update.channel);
    let updates = (await this.get(update.channel)).map(v => v.ID() === id ? update : v);
    await this.set(update.channel, updates);
    await this._unlock(update.channel);
  }


  /*****************************************************************************
  *** Value iterators
  *****************************************************************************/

  async *flatValues() {
    const values = await this.values();
    for (let value of values) {
      if (Array.isArray(value)) {
        for (let item of value) {
          yield item;
        }
      } else {
        yield value;
      }
    }
  }

  async *tickIterable(tickLimit) {
    const values = await asyncArray(this.flatValues()),
    size = values.length,
    valueIterator = values.values(); // Maybe a better way to do this
    let tickSize = 1;
    if (size > tickLimit) tickSize = Math.ceil(size/tickLimit);
    let tickStep = 1;
    if (size < tickLimit) tickStep = Math.floor(tickLimit/size);
    for (let i=0;i<tickLimit;i++) {
      let result = [];
      if (i % tickStep === 0) {
        for (let j=0;j<tickSize;j++) {
          let v = valueIterator.next();
          if (!v.done && v.value) result.push(v.value);
        }
      }
      yield result;
    }
  }
}

module.exports = UpdateCache;
