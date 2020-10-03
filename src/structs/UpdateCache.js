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

const { Collection } = require('discord.js');
const SaveInterface = require('./save/SaveInterface.js');
const SaveJSON = require('./save/SaveJSON.js');
const { debugLog, verbooseLog } = require('../debug.js');
const Update = require('./Update.js');

class UpdateCache extends Collection {
  constructor(filename) {
    super();
    this._saveLock = false;
    this._saveLockQueue = new Array();
    this._locks = new Map();
    this.saveInterface = new SaveInterface();
    if (filename) {
      this.saveInterface = new SaveJSON(filename);
    }
  }

  /*****************************************************************************
  *** Raw R/W functions
  *****************************************************************************/

  async load() {
    await this.saveLock();
    try {
      await this.saveInterface.load(this);
    } catch(e) {
      console.error(e);
    }
    await this.saveUnlock();
  }

  async save() {
    await this.saveLock();
    try {
      await this.saveInterface.save(this);
    } catch(e) {
      console.error(e);
    }
    await this.saveUnlock();
  }

  set(key, value, dontSave) {
    Collection.prototype.set.call(this, key, value);
    if (dontSave !== true) return this.save();
    verbooseLog(`Set ${key} without saving`);
  }

  delete(key, dontSave) {
    Collection.prototype.delete.call(this, key);
    if (!dontSave) return this.save();
    debugLog(`Deleted ${key} without saving`);
  }

  async saveLock() {
    if (this._saveLock) {
      let queue = this._saveLockQueue;
      await new Promise((resolve) => {
        queue.push(resolve);
      });
    }
    return this._saveLock = true;
  }

  async saveUnlock() {
    if (this._saveLockQueue.length > 0) {
      this._saveLockQueue.pop(0)();
    } else {
      this._saveLock = false;
    }
  }

  async deleteEmpty() {
    await this.saveLock();
    let changed = false;
    for (let entry of this.entries()) {
      if (Array.isArray(entry[1]) && entry[1].length === 0) {
        this.delete(entry[0], true);
        changed = true;
        debugLog(`Encountered empty channel ${entry[0]}`);
      }
    }
    if (changed) {
      try {
        await this.saveInterface.save(this);
      } catch(e) {
        console.error(e);
      }
    }
    await this.saveUnlock();
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

  async updateAdd(update, options) {
    if (!(update instanceof Update)) throw new Error('status must be an instance of status', update);

    await this._lock(update.channel);

    // TODO: Check guild limit and duplicates

    if (this.has(update.channel)) {
      let updates = this.get(update.channel);
      if (!Array.isArray(updates)) updates = [updates];

      // Check server is allowed to add another updater
      if (isNaN(options.channelLimit) || options.channelLimit === 0 || updates.length < options.channelLimit) {
        updates.push(update);
        await this.set(update.channel, updates);
      } else {
        await this._unlock(update.channel);
        return `Sorry this channel has reached it's limit of ${options.channelLimit} active server statuses`;
      }
    } else {
      await this.set(update.channel, [update]);
    }

    this._unlock(update.channel);
  }

  async updateRemove(update) {
    if (!(update instanceof Update)) throw new Error('status must be an instance of status', update);

    await this._lock(update.channel);

    if (this.has(update.channel)) {
      let updates = this.get(update.channel);
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

  /*****************************************************************************
  *** Read functions
  *****************************************************************************/

  *flatValues() {
    const values = this.values();
    let result = values.next();
    while (!result.done) {
      if (Array.isArray(result.value)) {
        for (let item of result.value) {
          yield item;
        }
      } else {
        yield result.value;
      }
      result = values.next();
    }
  }

  *tickIterable(tickLimit) {
    const values = Array.from(this.flatValues()),
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
