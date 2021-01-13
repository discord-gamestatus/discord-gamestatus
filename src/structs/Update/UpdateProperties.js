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

const { Guild, Message, TextChannel } = require('discord.js-light');
// const { STATUS_PERMISSIONS } = require('../../constants.js');
const { verboseLog } = require('../../debug.js');

function isNull(v) {
  return v === null || v === undefined;
}

module.exports = {
  async getGuild(client) {
    if (this._guild) return this._guild;
    this._guild = !isNull(this.guild) ? await client.guilds.fetch(this.guild) : undefined;
    return this._guild;
  },

  async getChannel(client) {
    if (this._channel) return this._channel;
    let guild = await this.getGuild(client);
    this._channel = (!isNull(guild) && !isNull(this.channel)) ? await client.channels.fetch(this.channel) : undefined;
    return this._channel;
  },

  async getMessage(client) {
    if (this._message) return this._message;
    let channel = await this.getChannel(client);
    try {
      this._message = (!isNull(channel) && !isNull(this.message)) ? await channel.messages.fetch(this.message) : undefined;
    } catch(e) {
      verboseLog(e);
      return undefined;
    }
    return this._message;
  },

  async setGuild(client, guild) {
    const oldGuild = this.guild;
    if (guild instanceof Guild) {
      this.guild = guild.id;
      this._guild = guild;
    } else {
      this.guild = guild;
      this._guild = undefined;
    }
    if (oldGuild !== this.guild) {
      await client.updateCache.updateSave(this);
    }
  },

  async setChannel(client, channel) {
    const oldChannel = this.channel;
    if (channel instanceof TextChannel) {
      this.channel = channel.id;
      this._channel = channel;
    } else {
      this.channel = channel;
      this._channel = undefined;
    }
    if (oldChannel !== this.channel) {
      await client.updateCache.updateSave(this);
    }
  },

  async setMessage(client, message) {
    const oldMessage = this.message;
    if (message instanceof Message) {
      this.message = message.id;
      this._message = message;
    } else {
      this.message = message;
      this._message = undefined;
    }
    if (oldMessage !== this.message) {
      await client.updateCache.updateSave(this);
    }
  },

  async shouldDelete(client) {
    if (this._shouldDelete === true) return true;
    const guild = await this.getGuild(client);
    if (guild === undefined || guild.deleted) return true;
    const channel = await this.getChannel(client);
    if (channel === undefined || channel.deleted) return true;
    return false;
    /*
    const permissions = channel.permissionsFor(client.user);
    if (permissions === null) return true;
    return !permissions.has(STATUS_PERMISSIONS, true);
    */
  },

  messageLink() {
    return `https://discordapp.com/channels/${this.guild}/${this.channel}/${this.message}`;
  }
};
