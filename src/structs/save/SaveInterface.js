/* Abstract base class */
class SaveInterface {
  /* Save the entire config */
  async save(updateCache) {
    if (!this.isUpdateCache(updateCache)) throw new Error('Must provide an UpdateCache object');
  }

  /* Load the entire config */
  async load(updateCache) {
    if (!this.isUpdateCache(updateCache)) throw new Error('Must provide an UpdateCache object');
  }

  isUpdateCache(updateCache) {
    return updateCache instanceof require('../UpdateCache.js'); // UpdateCache must be required here as SaveInterface is required by UpdateCache
  }
}

module.exports = SaveInterface
