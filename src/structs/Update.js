const Serializable = require('./Serializable.js');
const generateEmbed = require('../embed.js');
const connectDiff = require('../connectDiff.js');
const { query } = require('../query.js');
const { allSettled } = require('../util.js');
const { debugLog } = require('../debug.js');

const { Guild, TextChannel, Message } = require('discord.js');

let boundQuery;

class Update extends Serializable {
  constructor(opts, objs) {
    super();

    /* Serializable.parse will not provide opts */
    if (opts) {
      this.guild = opts.guild;
      this.channel = opts.channel;
      this.message = opts.message;
      this.players = null;
      this.type = opts.type;
      this.ip = opts.ip;
      this.notifications = opts.notifications ? opts.notifications : {};

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

  async getGuild(client) {
    if (this._guild) return this._guild;
    this._guild = client.guilds.get(this.guild);
    return this._guild;
  }

  async getChannel(client) {
    if (this._channel) return this._channel;
    let guild = await this.getGuild(client);
    this._channel = guild !== undefined ? guild.channels.get(this.channel) : undefined;
    return this._channel;
  }

  async getMessage(client) {
    if (this._message) return this._message;
    let channel = await this.getChannel(client);
    this._message = (channel !== undefined && this.message !== undefined) ? await channel.fetchMessage(this.message) : undefined;
    return this._message;
  }

  async setGuild(client, guild) {
    if (guild instanceof Guild) {
      this.guild = guild.id;
      this._guild = guild;
    } else {
      this.guild = guild;
    }
    await client.updateCache.save();
  }

  async setChannel(client, channel) {
    if (channel instanceof TextChannel) {
      this.channel = channel.id;
      this._channel = channel;
    } else {
      this.channel = channel;
    }
    await client.updateCache.save();
  }

  async setMessage(client, message) {
    if (message instanceof Message) {
      this.message = message.id;
      this._message = message;
    } else {
      this.message = message;
    }
    await client.updateCache.save();
  }

  async send(client, tick) {
    let _start = Date.now();

    if (!tick) tick = 0;

    let prevPlayers = this.players;
    if (!boundQuery) boundQuery = query.bind(client);
    let state = await boundQuery(this.type, this.ip);
    this.players = state.realPlayers ? state.realPlayers.map(v => v.name) : null;

    let diff = connectDiff(this.players, prevPlayers);

    await this.sendUpdate(client, tick, state, diff);
    await this.sendNotifications(client, state, diff);

    let _end = Date.now();
    debugLog(`Update completed in ${_end-_start}ms`);
  }

  async sendUpdate(client, tick, state, diff) {
    let embed = generateEmbed(state, tick);

    let args = [diff.all.length > 0 ? diff.all.map(v => v.msg).join('\n') : '', embed];

    let message = await this.getMessage(client);
    if (message) {
      /* If players have joined send new message and delete old triggering notification
      * TODO: Add option so user can configure when new message updates are sent
      */
      if (diff.connect.length > 0) {
        await message.delete();
      } else {
        return await message.edit.apply(message, args);
      }
    }

    let channel = await this.getChannel(client);
    if (channel) {
      message = await channel.send.apply(channel, args);
      await this.setMessage(client, message);
      return;
    }
  }

  async sendNotifications(client, state, diff) {
    let promises = [];
    for (let player of diff.all) {
      if (player.name in this.notifications) {
        for (let user in this.notifications[player.name]) {
          let u = client.users.get(user);
          if (u) promises.push(u.send(`${player.msg} to ${state.name} (${state.connect})`));
        }
      }
    }
    await allSettled(promises);
  }
}

module.exports = Update;
