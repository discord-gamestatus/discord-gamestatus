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
const { verboseLog } = require('../../debug.js');

/**
* Check if a value is null or undefined
* @param {Any} v - Value to check
* @returns {Boolean} Whether value is strictly null or undefined
*/
function isNull(v) {
  return v === null || v === undefined;
}

module.exports = {
  async getGuild(client, dontForge) {
    if (this._guild) return this._guild;
    if (dontForge) {
      this._guild = !isNull(this.guild) ? await client.guilds.fetch(this.guild) : undefined;
      return this._guild;
    }
    return !isNull(this.guild) ? client.guilds.forge(this.guild) : undefined;
  },

  async getChannel(client, dontForge) {
    if (this._channel) return this._channel;
    const guild = await this.getGuild(client, dontForge);
    if (dontForge) {
      this._channel = (!isNull(guild) && !isNull(this.channel)) ? await client.channels.fetch(this.channel) : undefined;
      return this._channel;
    }
    return (!isNull(guild) && !isNull(this.channel)) ? guild.channels.forge(this.channel) : undefined;
  },

  async getMessage(client, dontForge) {
    if (this._message) return this._message;
    const channel = await this.getChannel(client, dontForge);
    if (dontForge) {
      try {
        this._message = (!isNull(channel) && !isNull(this.message)) ? await channel.messages.fetch(this.message) : undefined;
      } catch(e) {
        verboseLog(e);
        return undefined;
      }
      return this._message;
    }
    return (!isNull(channel) && !isNull(this.message)) ? channel.messages.forge(this.message) : undefined;
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
    if (oldGuild !== this.guild && !this._dontAutoSave) {
      await client.updateCache.update(this);
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
    if (oldChannel !== this.channel && !this._dontAutoSave) {
      await client.updateCache.update(this);
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
    if (oldMessage !== this.message && !this._dontAutoSave) {
      await client.updateCache.update(this);
    }
  },

  async shouldDelete(client) {
    if (this._shouldDelete === true) return true;
    const guild = await this.getGuild(client);
    if (guild === undefined || guild.deleted) return true;
    const channel = await this.getChannel(client);
    if (channel === undefined || channel.deleted) return true;
    /* Permissions not checked here as the status will delete itself if it gets
    *  lack of permission error code when updating */
    return false;
  },

  messageLink() {
    return `https://discordapp.com/channels/${this.guild}/${this.channel}/${this.message}`;
  }
};
