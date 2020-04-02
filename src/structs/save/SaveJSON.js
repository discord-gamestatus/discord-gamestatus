const fs = require('fs').promises;
const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');
const Serializable = require('../Serializable.js');
const { allSettled, isOfBaseType } = require('../../util.js');

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
    } else if (isOfBaseType(item, Serializable)) {
      obj[key] = item.serialize();
    }
    return true;
  }

  async load(updateCache) {
    if (!this.isUpdateCache(updateCache)) throw new Error('Must provide an UpdateCache object');

    let content = await fs.readFile(this.filename);
    let obj = JSON.parse(content);

    let promises = [];
    for (let [key, item] of Object.entries(obj)) {
      promises.push(this.loadItem(updateCache, key, item));
    }
    let res = await allSettled(promises), errs = res.filter(v => v !== true);
    console.log(`Loaded ${promises.length} configs...`);
    if (errs.length > 0) console.error(errs);
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
