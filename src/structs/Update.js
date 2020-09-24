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

const Serializable = require('./Serializable.js');
const { extendPrototype } = require('@douile/bot-utilities');

class Update extends Serializable {
  constructor(opts, objs) {
    super();

    /* Serializable.parse will not provide opts */
    if (opts) {
      this.guild = opts.guild;
      this.channel = opts.channel;
      this.message = opts.message;
      this.state = {};
      this.type = opts.type;
      this.ip = opts.ip;
      this.name = opts.ip;
      this.notifications = opts.notifications ? opts.notifications : {};
      this.options = opts.options;

      if (objs) {
        this._guild = objs.guild;
        this._channel = objs.channel;
        this._message = objs.message;

        if (this._message) {
          this._channel = this._message.channel;
          this._guild = this._message.guild;
        } else if (this._channel) {
          this._guild = this._channel.guild;
        }

        if (this._guild) this.guild = this._guild.id;
        if (this._channel) this.channel = this._channel.id;
        if (this._message) this.message = this._message.id;

      } else {
        this._guild = undefined;
        this._channel = undefined;
        this._message = undefined;
      }
    }
  }
  ID() {
    return `${this.guild}:${this.channel}:${this.guild}`;
  }
}

const UpdateEmbed = require('./Update/UpdateEmbed.js');
const UpdateOptions = require('./Update/UpdateOptions.js');
const UpdateProperties = require('./Update/UpdateProperties.js');
const UpdateSend = require('./Update/UpdateSend.js');
extendPrototype(Update, UpdateEmbed);
extendPrototype(Update, UpdateOptions);
extendPrototype(Update, UpdateProperties);
extendPrototype(Update, UpdateSend);

module.exports = Update;
