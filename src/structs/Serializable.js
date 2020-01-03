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
    let result = new this.constructor();
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
