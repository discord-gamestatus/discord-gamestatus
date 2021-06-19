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

const fs = require('fs').promises;

const { Collection } = require('discord.js-light');
const { allSettled, isOfBaseType } = require('@douile/bot-utilities');

const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');
const Serializable = require('../Serializable.js');
const { infoLog, errorLog } = require('../../debug.js');

function eitherSelector(update) {
  if (update.ip !== undefined)
    return { key: 'ip', value: update.ip };
  if (update.message !== undefined)
    return { key: 'message', value: update.message };
  throw new Error('Not enough identifiers for', update);
}

class SaveJSON extends SaveInterface {
  constructor(filename) {
    super();
    this.filename = filename;
    this.saveTimeout = 30000; // 30 secs

    this._saveTimer = null;
    this._saveInProgress = null;
    this._requeueWhenDone = false;
    this._cache = new Collection();
  }

  async load() {
    let r;
    try {
      r = await this._load();
    } catch(e) {
      if (e.code === 'ENOENT') {
        console.warn('No save file found, starting new save file');
      } else {
        throw e;
      }
    }
    return r;
  }

  close() {
    if (this._saveTimer !== null) {
      if (this._saveInProgress !== null) {
        return this._saveInProgress;
      } else {
        clearTimeout(this._saveTimer);
      }
    }
    return this._save();
  }

  get(opts) {
    if (opts.message !== undefined) {
      // Very slow
      return Array.from(this._cache.values()).flat().filter(i => i.message === opts.message);
    } else if (opts.channel !== undefined) {
      return this._cache.get(opts.channel);
    } else if (opts.guild !== undefined) {
      // Very slow
      return Array.from(this._cache.values()).flat().filter(i => i.guild === opts.guild);
    } else {
      throw new Error('Must specify a search param when getting statuses');
    }
  }

  set(status) {
    if (this._cache.has(status.channel)) {
      const l = this._cache.get(status.channel);
      if (!l.includes(status)) l.push(status);
      this._cache.set(status.channel, l);
    } else {
      this._cache.set(status.channel, [status]);
    }
    this.queueSave();
  }

  delete(opts) {
    // Here we don't use guild as channel IDs are unique and the key we use,
    // however guild is checked to be specified to maintain consitency with
    // SavePSQL
    if (opts.guild === undefined || opts.channel === undefined) {
      throw new Error('Must specify search params when deleting statuses');
    }

    let selector;
    if (opts instanceof Update || 'ip' in opts || 'message' in opts) {
      selector = eitherSelector(opts);
    }

    let deleted = -1;
    if (selector !== undefined) {
      const l = this._cache.get(opts.channel);
      const n = l.filter(i => i[selector.key] !== selector.value);
      if (n.length > 0) {
        this._cache.set(opts.channel, n);
      } else {
        this._cache.delete(opts.channel);
      }
      deleted = l.length - n.length;
    } else {
      deleted = this._cache.get(opts.channel).length;
      this._cache.delete(opts.channel);
    }

    this.queueSave();
    return deleted;
  }

  has(status) {
    if (status.guild === undefined || status.channel === undefined) {
      throw new Error('Must specify search params when querying statuses');
    }

    let selector = eitherSelector(status);
    if (this._cache.has(status.channel)) {
      return this._cache.get(status.channel).some(i => i[selector.key] === selector.value);
    }
    return false;
  }

  values() {
    return this._cache.values();
  }

  entries() {
    return this._cache.entries();
  }

  /*****************************************************************************
  *** Helpers
  *****************************************************************************/

  queueSave() {
    if (this._saveTimer !== null) {
      if (this._saveInProgress !== null) this._requeueWhenDone = true;
    } else {
      this._saveTimer = setTimeout(this.save.bind(this), this.saveTimeout);
    }
  }

  save() {
    this._saveInProgress = this._save();
    const i = this;
    this._saveInProgress.then(function() {
      i._saveTimer = null;
      i._saveInProgress = null;
      if (i._requeueWhenDone) {
        i.queueSave();
        i._reqeueWhenDone = false;
      }
    }).catch(function() {
      console.error.apply(this, arguments);
      i._saveTimer = null;
      i._saveInProgress = null;
      i.queueSave();
      i._requeueWhenDone = false;
    })
  }
  async _save() {
    let obj = {};

    let promises = [];
    for (let [key, item] of this._cache.entries()) {
      promises.push(this.serializeItem(obj, key, item));
    }
    await allSettled(promises);
    let content = JSON.stringify(obj);
    await fs.writeFile(this.filename, content);
  }

  async serializeItem(obj, key, item) {
    if (isOfBaseType(item, Array)) {
      obj[key] = new Array(item.length);
      for (let i=0;i<item.length;i++) {
        await this.serializeItem(obj[key], i, item[i]);
      }
    } else if (isOfBaseType(item, Object)) { // NOTE: Maybe we shouldn't deal with this cases as Serializables are transformed into objects
      obj[key] = {};
      for (let i in item) {
        await this.serializeItem(obj[key], i, item[i]);
      }
    } else if (item instanceof Serializable) {
      obj[key] = item.serialize();
    }
    return true;
  }

  async _load() {
    let content = await fs.readFile(this.filename);
    let obj;
    try {
      obj = JSON.parse(content);
    } catch(e) {
      await fs.copyFile(this.filename, `${this.filename}.damaged`);
      throw e;
    }

    let promises = [];
    for (let [key, item] of Object.entries(obj)) {
      promises.push(this.parseItem(key, item));
    }
    let res = await allSettled(promises), errs = res.filter(v => v !== true);
    infoLog(`Loaded ${promises.length} configs...`);
    if (errs.length > 0) errorLog(errs);
  }

  async parseItem(key, item) {
    let res; // NOTE: Type checking here is a bit flippant
    if (isOfBaseType(item, Array)) {
      res = new Array(item.length);
      for (let i=0;i<item.length;i++) {
        res[i] = Update.parse(item[i]);
      }
    } else {
      res = Update.parse(item);
    }
    this._cache.set(key, res, true);
    return true;
  }

}

module.exports = SaveJSON;
