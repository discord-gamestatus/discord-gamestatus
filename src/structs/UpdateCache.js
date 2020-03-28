const { Collection } = require('discord.js');
const SaveInterface = require('./save/SaveInterface.js');
const SaveJSON = require('./save/SaveJSON.js');

class UpdateCache extends Collection {
  constructor(filename) {
    super();
    this._saveLock = false;
    this._saveLockQueue = new Array();
    this.saveInterface = new SaveInterface();
    if (filename) {
      this.saveInterface = new SaveJSON(filename);
    }
  }
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
    console.warn(`Set ${key} without saving`);
  }

  delete(key, dontSave) {
    Collection.prototype.delete.call(this, key);
    if (!dontSave) return this.save();
    console.warn(`Deleted ${key} without saving`);
  }

  async saveLock() {
    if (this._saveLock) {
      let queue = this.saveLockQueue;
      await new Promise((resolve) => {
        queue.push(resolve);
      });
    }
    return this._saveLock = true;
  }

  async saveUnlock() {
    if (this._saveLockQueue.length > 0) {
      this._saveLock.pop(0)();
    } else {
      this._saveLock = false;
    }
  }

  *tickIterable(tickLimit) {
    let size = this.size, valueIterator = this.values(), tickSize = 1;
    if (size > tickLimit) tickSize = Math.ceil(size/tickLimit);
    for (let i=0;i<tickLimit;i++) {
      let result = [];
      for (let j=0;j<tickSize;j++) {
        let v = valueIterator.next();
        if (!v.done && v.value) result.push(v.value);
      }
      yield result;
    }
  }
}

module.exports = UpdateCache;
