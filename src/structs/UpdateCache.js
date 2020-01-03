const { Collection } = require('discord.js');

class UpdateCache extends Collection {
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
