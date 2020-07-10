const { Guild, Message, TextChannel } = require('discord.js');

module.exports = {
  async getGuild(client) {
    if (this._guild) return this._guild;
    this._guild = client.guilds.resolve(this.guild);
    return this._guild;
  },

  async getChannel(client) {
    if (this._channel) return this._channel;
    let guild = await this.getGuild(client);
    this._channel = guild !== undefined ? guild.channels.resolve(this.channel) : undefined;
    return this._channel;
  },

  async getMessage(client) {
    if (this._message) return this._message;
    let channel = await this.getChannel(client);
    try {
      this._message = (channel !== undefined && this.message !== undefined) ? await channel.messages.fetch(this.message) : undefined;
    } catch(e) {
      return undefined;
    }
    return this._message;
  },

  async setGuild(client, guild) {
    if (guild instanceof Guild) {
      this.guild = guild.id;
      this._guild = guild;
    } else {
      this.guild = guild;
    }
    await client.updateCache.save();
  },

  async setChannel(client, channel) {
    if (channel instanceof TextChannel) {
      this.channel = channel.id;
      this._channel = channel;
    } else {
      this.channel = channel;
    }
    await client.updateCache.save();
  },

  async setMessage(client, message) {
    if (message instanceof Message) {
      this.message = message.id;
      this._message = message;
    } else {
      this.message = message;
    }
    await client.updateCache.save();
  },

  async shouldDelete(client) {
    const guild = await this.getGuild(client);
    if (guild === undefined || guild.deleted) return true;
    const channel = await this.getChannel(client);
    if (channel === undefined || channel.deleted) return true;
    return false;
  },

  messageLink() {
    return `https://discordapp.com/channels/${this.guild}/${this.channel}/${this.message}`;
  }
};
