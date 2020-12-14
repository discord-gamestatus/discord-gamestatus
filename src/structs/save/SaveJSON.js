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

const { allSettled, isOfBaseType } = require('@douile/bot-utilities');

const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');
const Serializable = require('../Serializable.js');
const { infoLog, errorLog } = require('../../debug.js');


class SaveJSON extends SaveInterface {
  constructor(filename) {
    super();
    this.filename = filename;
  }

  async save(updateCache) {
    if (!this.isUpdateCache(updateCache)) throw new Error('Must provide an UpdateCache object');
    let obj = {};

    let promises = [];
    for (let [key, item] of updateCache.entries()) {
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

  async load(updateCache) {
    if (!this.isUpdateCache(updateCache)) throw new Error('Must provide an UpdateCache object');

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
      promises.push(this.loadItem(updateCache, key, item));
    }
    let res = await allSettled(promises), errs = res.filter(v => v !== true);
    infoLog(`Loaded ${promises.length} configs...`);
    if (errs.length > 0) errorLog(errs);
  }

  async loadItem(updateCache, key, item) {
    let res; // NOTE: Type checking here is a bit flippant
    if (isOfBaseType(item, Array)) {
      res = new Array(item.length);
      for (let i=0;i<item.length;i++) {
        res[i] = Update.parse(item[i]);
      }
    } else {
      res = Update.parse(item);
    }
    updateCache.set(key, res, true);
    return true;
  }
}

module.exports = SaveJSON;
