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

const fs = require('fs').promises;

const { Collection } = require('discord.js-light');
const { allSettled, isOfBaseType } = require('@douile/bot-utilities');

const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');
const Serializable = require('../Serializable.js');
const { infoLog, errorLog } = require('../../debug.js');


class SaveJSON extends SaveInterface {
  constructor(filename) {
    super();
    throw new Error('SaveJSON is not currently supported');
    this.filename = filename;
    this._saveLock = false;
    this._saveLockQueue = new Array();
    this._cache = new Collection();
  }

  get(key) {
    return this._cache.get(key);
  }

  async set(key, value) {
    this._cache.set(key, value);
    await this.save();
  }

  async delete(key) {
    this._cache.delete(key);
    await this.save();
  }

  has(key) {
    return this._cache.has(key);
  }

  values() {
    return this._cache.values();
  }

  entries() {
    return this._cache.entries();
  }

  /*****************************************************************************
  *** Save/load
  *****************************************************************************/

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

  async save() {
    await this.saveLock();
    try {
      await this._save(this);
    } catch(e) {
      errorLog(e);
    }
    await this.saveUnlock();
  }

  async _save() {
    let obj = {};

    let promises = [];
    for (let [key, item] of this._cache.entries()) {
      promises.push(this.saveItem(obj, key, item));
    }
    await allSettled(promises);
    let content = JSON.stringify(obj);
    await fs.writeFile(this.filename, content);
  }

  async saveItem(obj, key, item) {
    if (isOfBaseType(item, Array)) {
      obj[key] = new Array(item.length);
      for (let i=0;i<item.length;i++) {
        await this.saveItem(obj[key], i, item[i]);
      }
    } else if (isOfBaseType(item, Object)) { // NOTE: Maybe we shouldn't deal with this cases as Serializables are transformed into objects
      obj[key] = {};
      for (let i in item) {
        await this.saveItem(obj[key], i, item[i]);
      }
    } else if (item instanceof Serializable) {
      obj[key] = item.serialize();
    }
    return true;
  }

  async load() {
    await this.saveLock();
    try {
      await this._load(this);
    } catch(e) {
      errorLog(e);
    }
    await this.saveUnlock();
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
      promises.push(this.loadItem(key, item));
    }
    let res = await allSettled(promises), errs = res.filter(v => v !== true);
    infoLog(`Loaded ${promises.length} configs...`);
    if (errs.length > 0) errorLog(errs);
  }

  async loadItem(key, item) {
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

  close() {
    return this.save();
  }
}

module.exports = SaveJSON;
