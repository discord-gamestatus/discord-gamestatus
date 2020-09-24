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
