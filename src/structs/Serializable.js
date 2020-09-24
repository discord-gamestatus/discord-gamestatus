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

class Serializable {
  serialize() {
    let object = {}, descriptors = Object.getOwnPropertyDescriptors(this);
    for (let name in descriptors) {
      let descriptor = descriptors[name], type = typeof descriptor.value;
      if (descriptor.enumerable && type !== 'function' && type !== 'undefined' && !name.startsWith('_')) {
        object[name] = descriptor.value;
      }
    }
    return object;
  }

  static parse(object) {
    let result = new this();
    return Object.defineProperties(result, Object.getOwnPropertyDescriptors(object));
  }

  serializeJson() {
    return JSON.stringify(this.serialize());
  }

  static parseJson(data) {
    return this.parse(JSON.parse(data));
  }
}

module.exports = Serializable;
