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
  /* Called when bot closes */
  close() {}

  /* Called when bot starts */
  load() {}

  /* Get a value */
  get(key) {}

  /* Set a value */
  set(key, value) {}

  /* Delete a value */
  delete(key) {}

  /* Get values iterator */
  values() {}

  /* Get entries */
  entries() {}
}

module.exports = SaveInterface
