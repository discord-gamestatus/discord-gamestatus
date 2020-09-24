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

const { isOfBaseType } = require('@douile/bot-utilities');

const DEFAULT_OPTIONS = {
  dots: ['⚪','⚫'],
  title: '{name} server status',
  description: 'Playing {map} with {numplayers}/{maxplayers} players\nConnect with {connect}',
  color: 0x2894C2,
  image: '',
  columns: 3,
  maxEdits: 900000,
  connectUpdate: true,
  disconnectUpdate: true
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
    if (isOfBaseType(DEFAULT_OPTIONS[optionName], Boolean)) newValue = ['1','true','t','yes','y'].includes(value.toLowerCase().trim().split(' ')[0]);
    if (isOfBaseType(DEFAULT_OPTIONS[optionName], Array)) newValue = value.split(' ');
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
