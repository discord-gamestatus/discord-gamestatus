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

/* Abstract base class
All getters/setters are optionally async
*/
class SaveInterface {
  /**
  * Called when bot closes
  * @async
  * @void
   */
  close() {}

  /**
  * Called when bot starts
  * @async
  * @void
  */
  load() {}

  /**
  * Get a value
  * @async
  * @param {String} guild     - Guild to get
  * @param {String} channel   - Channel to get
  * @param {String} ip        - IP to get
  * @returns {Update?} value of key
  */
  get() {}

  /**
  * Set a value
  * @async
  * @param {String} guild     - Guild to set
  * @param {String} channel   - Channel to set
  * @param {String} ip        - IP to set
  * @param {Update} value
  * @returns {Boolean} success?
  * */
  set() {}

  /**
  * Delete a value
  * @async
  * @param {String} guild     - Guild to delete
  * @param {String} channel   - Channel to delete
  * @param {String} ip        - IP to set
  * @returns {Boolean} success?
  */
  delete() {}

  /**
  * Check if key exists
  * @async
  * @param {String} guild     - Guild to check for
  * @param {String} channel   - Channel to check for
  * @param {String} ip        - IP to check for
  * @returns {Boolean} Whether update exists
  */
  has() {}

  /**
  * Get values iterator
  * @returns AsyncIterator<Update[]>
  */
  values() {}

  /**
  * Get entries
  * @returns AsyncIterator<String, Update[]>
  */
  entries() {}
}

module.exports = SaveInterface
