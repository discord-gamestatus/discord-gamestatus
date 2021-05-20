/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2021 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { infoLog, debugLog, warnLog, verboseLog } = require('../debug.js');
const SaveInterface = require('./save/SaveInterface.js');
const SaveJSON = require('./save/SaveJSON.js');
let SavePSQL;
try {
  SavePSQL = require('./save/SavePSQL.js');
} catch(e) {
  infoLog('[UpdateCache] "pg" is not installed, databases are not enabled');
}
const Update = require('./Update.js');
const { getLimits } = require('../limits.js');
const { asyncArray } = require('../utils.js');

class UpdateCache {
  constructor(opts) {
    this._locks = new Map();
    this.saveInterface = new SaveInterface();
    if (opts.database && !SavePSQL) warnLog(`Not using database "${opts.database}" as "pg" is not installed`);
    if (opts.database && SavePSQL) {
      this.saveInterface = new SavePSQL(opts.database);
      infoLog(`[UpdateCache] Using PSQL`);
    } else if (opts.filename) {
      this.saveInterface = new SaveJSON(opts.filename);
      infoLog(`[UpdateCache] Using JSON "${opts.filename}"`);
    } else {
      this.saveInterface = new SaveJSON();
      infoLog(`[UpdateCache] using JSON "./_save.json"`);
    }
  }

  async load() {
    await this.saveInterface.load();
  }

  get(key) {
    return this.saveInterface.get(key);
  }

  set(value) {
    return this.saveInterface.set(value);
  }

  has(value) {
    return this.saveInterface.has(value);
  }

  delete(value) {
    return this.saveInterface.delete(value);
  }

  values() {
    return this.saveInterface.values();
  }

  entries() {
    return this.saveInterface.entries();
  } 

  close() {
    return this.saveInterface.close();
  }

  /*****************************************************************************
  *** Abstracted update functions
  *****************************************************************************/

  /**
   * Check if an update would be valid to add
   * @param update Update to check
   * @param client Discord.js Client object
   * @return String? Optional error message (undefined if no error)
   */
  async canAddUpdate(update, client) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);
    // Perform checks
    
    const guild = await update.getGuild(client);

    const guildUpdates = await this.get({ guild: update.guild });
    const guildUpdateCount = guildUpdates.length;
    let channelUpdateCount = 0;

    for (let u of guildUpdates) {
      if (u.ip === update.ip && !client.config.allowDuplicates) 
        return `Sorry this server already has an update using the IP \`${update.ip}\``;

      if (u.channel === update.channel) channelUpdateCount++;
    }

    const limits = await getLimits(client, guild.ownerID);

    if ( !(isNaN(client.config.guildLimit) || client.config.guildLimit === 0 || guildUpdateCount < limits.guildLimit) ) {
      return `Sorry this server has reached its limit of ${limits.guildLimit} active server statuses`;
    }

    if ( !(isNaN(client.config.channelLimit) || client.config.channelLimit === 0 || channelUpdateCount < limits.channelLimit) ) {
      return `Sorry this channel has reached its limit of ${limits.channelLimit} active server statuses`;
    }

    return undefined;
  }

  async updateRemove(update) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);
    verboseLog(`Attempting to remove ${update.ID()}`);

    update._deleted = true;
    await this.delete(update); 

  }

  async updateSave(update) {
    if (!(update instanceof Update)) throw new Error('update must be an instance of Update', update);
    verboseLog(`Attempting to save ${update.ID()}`);

    await this.set(update);
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
