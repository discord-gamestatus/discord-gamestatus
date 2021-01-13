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

const { isOfBaseType, constants: { EMBED_LIMITS } } = require('@douile/bot-utilities');

const LimitedString = require('../LimitedString.js');
const LimitedNumber = require('../LimitedNumber.js');

const TitleLimit = LimitedString(EMBED_LIMITS.title,'...');
const DescriptionLimit = LimitedString(EMBED_LIMITS.description, '...');
const ImageLimit = LimitedString(300);
const ColorLimit = LimitedNumber(0, 0xFFFFFF);
const ColumnLimit = LimitedNumber(0, 6);
const EditLimit = LimitedNumber(1, 9e9);

const DEFAULT_OPTIONS = {
  dots: ['⚪','⚫'],
  title: new TitleLimit('{name} server status'),
  offlineTitle: new TitleLimit(`server **{name}**`),
  description: new DescriptionLimit('Playing {map} with {numplayers}/{maxplayers} players\nConnect with {connect}'),
  offlineDescription: new DescriptionLimit('Server is offline'),
  color: new ColorLimit(0x2894C2),
  offlineColor: new ColorLimit(0xFF0000),
  image: new ImageLimit(''),
  offlineImage: new ImageLimit(''),
  columns: new ColumnLimit(3),
  maxEdits: new EditLimit(900000),
  connectUpdate: false,
  disconnectUpdate: false
};

module.exports = {
  getOption(optionName) {
    return isOfBaseType(this.options, Object) ?
      (optionName in this.options ? (this.options[optionName] || DEFAULT_OPTIONS[optionName]) : DEFAULT_OPTIONS[optionName]) :
      DEFAULT_OPTIONS[optionName];
  },

  getOptions() {
    const res = {};
    for (let prop in DEFAULT_OPTIONS) {
      res[prop] = this.getOption(prop);
    }
    return res;
  },

  setOption(client, optionName, value, dontSave) {
    if (!(optionName in DEFAULT_OPTIONS)) return;
    if (!isOfBaseType(this.options, Object)) this.options = {};
    /* Use DEFAULT_OPTIONS constructors to typecast new value */
    // TODO: Add better support for setting arrays
    let newValue = value;
    if (newValue !== null && newValue !== undefined) {
      newValue = new DEFAULT_OPTIONS[optionName].__proto__.constructor(value);
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Number) && isNaN(newValue)) newValue = null;
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Boolean)) {
        if (isOfBaseType(value, String)) {
          newValue = ['1','true','t','yes','y'].includes(value.toLowerCase().trim().split(' ')[0]);
        }
      }
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Array)) {
        if (isOfBaseType(value, String)) {
          newValue = value.split(' ');
        } else if (isOfBaseType(value, Array)) {
          newValue = value;
        }
      }
      if (!isOfBaseType(newValue, DEFAULT_OPTIONS[optionName].__proto__.constructor)) newValue = null;
    }
    if ([DEFAULT_OPTIONS[optionName],null,undefined].includes(newValue)) {
      delete this.options[optionName];
    } else {
      this.options[optionName] = newValue;
    }
    if (!dontSave) return client.updateCache.updateSave(this);
  },

  async deleteOption(client, optionName) {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    delete this.options[optionName];
    await client.updateCache.updateSave(this);
  },

  parse(object) {
    let result = new this();

    const options = object?.options || {};
    delete object['options'];
    for (let key in options) {
      if (key in DEFAULT_OPTIONS) {
        result.setOption(undefined, key, options[key], true);
      }
    }

    return Object.defineProperties(result, Object.getOwnPropertyDescriptors(object));
  }
};
