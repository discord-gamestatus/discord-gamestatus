const { isOfBaseType } = require('../../util.js');

const DEFAULT_OPTIONS = {
  dots: ['⚪','⚫'],
  title: function(server) {
    return `${server.name} server status`
  },
  description: function(server) {
    return `Playing ${server.map} with ${server.numplayers}/${server.maxplayers} players\nConnect with ${server.connect}`;
  },
  color: 0x2894C2,
  image: undefined,
  columns: 3,
  maxEdits: 100
};

module.exports = {
  getOption(optionName) {
    return isOfBaseType(this.options, Object) ?
      (optionName in this.options ? this.options[optionName] : DEFAULT_OPTIONS[optionName]) :
      DEFAULT_OPTIONS[optionName];
  },

  async setOption(client, optionName, value) {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    /* Use DEFAULT_OPTIONS constructors to typecast new value */
    // TODO: Add workaround for function types (maybe convert to regex function),
    // maybe change option so that stored value is formattable string
    this.options[optionName] = optionName in DEFAULT_OPTIONS ?
      DEFAULT_OPTIONS[optionName].__proto__.constructor(value) :
      value;
    await client.updateCache.save();
  },

  async deleteOption(client, optionName) {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    delete this.options[optionName];
    await client.updateCache.save();
  }
};
