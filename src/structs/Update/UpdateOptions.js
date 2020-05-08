const { isOfBaseType } = require('../../util.js');

const DEFAULT_OPTIONS = {
  dots: ['⚪','⚫'],
  title: '{name} server status',
  description: 'Playing {map} with {numplayers}/{maxplayers} players\nConnect with {connect}',
  color: 0x2894C2,
  image: '',
  columns: 3,
  maxEdits: 100
};

module.exports = {
  getOption(optionName) {
    return isOfBaseType(this.options, Object) ?
      (optionName in this.options ? this.options[optionName] : DEFAULT_OPTIONS[optionName]) :
      DEFAULT_OPTIONS[optionName];
  },

  getOptions() {
    const res = {};
    for (let prop in DEFAULT_OPTIONS) {
      res[prop] = this.getOption(prop);
    }
    return res;
  },

  async setOption(client, optionName, value) {
    if (!(optionName in DEFAULT_OPTIONS)) return;
    if (!isOfBaseType(this.options, Object)) this.options = {};
    /* Use DEFAULT_OPTIONS constructors to typecast new value */
    // TODO: Add better support for setting arrays
    let newValue = DEFAULT_OPTIONS[optionName].__proto__.constructor(value);
    if (isOfBaseType(DEFAULT_OPTIONS[optionName], Number) && isNaN(newValue)) newValue = null;
    if (!isOfBaseType(newValue, DEFAULT_OPTIONS[optionName].__proto__.constructor)) newValue = null;
    if ([DEFAULT_OPTIONS[optionName],null].includes(newValue)) {
      delete this.options[optionName];
    } else {
      this.options[optionName] = newValue;
    }
    await client.updateCache.save();
  },

  async deleteOption(client, optionName) {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    delete this.options[optionName];
    await client.updateCache.save();
  }
};
