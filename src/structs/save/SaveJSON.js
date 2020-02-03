const fs = require('fs').promises;
const SaveInterface = require('./SaveInterface.js');
const Update = require('../Update.js');
const Serializable = require('../Serializable.js');
const { allSettled } = require('../../util.js');

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
    // if (!(item instanceof Serializable)) return false;
    obj[key] = item.serialize();
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
    updateCache.set(key, Update.parse(item), true);
    return true;
  }
}

module.exports = SaveJSON;
