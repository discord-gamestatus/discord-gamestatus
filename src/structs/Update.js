const { performance } = require('perf_hooks');

const Serializable = require('./Serializable.js');
const generateEmbed = require('../embed.js');
const stateChanges = require('../stateChanges.js');
const { query } = require('../query.js');
const { allSettled } = require('../util.js');
const { debugLog } = require('../debug.js');

const { Guild, TextChannel, Message, RichEmbed, User } = require('discord.js');

let boundQuery;

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
    let _start = performance.now();

    if (!tick) tick = 0;

    let prevState = this.state;
    if (!boundQuery) boundQuery = query.bind(client);
    let state = await boundQuery(this.type, this.ip);
    this.state = {
      players: state.realPlayers ? state.realPlayers.map(v => v.name) : null,
      offline: state.offline,
      map: state.map
    };
    if (!state.offline) this.name = state.name;

    let changes = stateChanges(this.state, prevState);

    try {
      await this.sendUpdate(client, tick, state, changes);
    } catch(e) {
      console.warn('Error sending update', e);
    }
    try {
      await this.sendPlayerNotifications(client, state, changes.players);
    } catch(e) {
      // console.warn('Error sending player notifications', e);
    }
    try {
      await this.sendServerNotifications(client, state, changes);
    } catch(e) {
      console.warn('Error sending server notifications', e);
    }

    let _end = performance.now();
    debugLog(`Update completed in ${_end-_start}ms`);
  }

  async sendUpdate(client, tick, state, changes) {
    let embed = generateEmbed(state, tick);

    let args = [changes.players.all.length > 0 ? changes.players.all.map(v => v.msg).join('\n') : '', embed];

    let message = await this.getMessage(client);
    if (message) {
      /* If players have joined send new message and delete old triggering notification
      * TODO: Add option so user can configure when new message updates are sent
      */
      if (changes.players.connect.length > 0) {
        try {
          await message.delete();
        } catch(e) {
          // Do nothing
        }
      } else {
        let err = false;
        try {
          await message.edit.apply(message, args);
        } catch(e) {
          err = true;
          try {
            await message.delete();
          } catch(e) {
            // Do nothing
          }
        }
        if (!err) return;
      }
    }

    let channel = await this.getChannel(client);
    if (channel) {
      message = await channel.send.apply(channel, args);
      await this.setMessage(client, message);
      return;
    }
  }

  async sendPlayerNotifications(client, state, diff) {
    let fields = {};
    for (let player of diff.all) {
      if (player.name in this.notifications) {
        let field = `${player.msg} ${player.connect ? 'to' : 'from'} ${state.name} (${state.connect})`;
        for (let user in this.notifications[player.name]) {
          if (user in fields) {
            fields[user].push(field);
          } else {
            fields[user] = [field];
          }
        }
      }
    }
    let promises = [];
    for (let user in fields) {
      let embed = new RichEmbed({
        title: 'Player update notification',
        description: fields[user].join('\n'),
        timestamp: Date.now()
      });
      let u = client.users.get(user);
      if (u instanceof User) promises.push(u.send(embed));
      else console.warn(user, 'Is not a valid user snowflake');
    }
    return await allSettled(promises);
  }

  async sendServerNotifications(client, state, changes) {
    if (!changes.offline && !changes.map) return;
    let embed = new RichEmbed({
      title: 'Server update notification',
      timestamp: Date.now()
    });
    if (changes.offline) {
      embed.setDescription(`${this.name} is now ${changes.offline.new ? 'Offline' : 'Online'}`);
    } else {
      embed.setDescription(this.name);
    }
    if (changes.map) {
      embed.addField('Changed map', `From **${changes.map.old}** to **${changes.map.new}**`);
    }
    let promises = [];
    for (let user in this.notifyServer) {
      let u = client.users.get(user);
      if (u instanceof User) promises.push(u.send(embed));
      else console.warn(user, 'Is not a valid user snowflake');
    }
    return await allSettled(promises);
  }
}

module.exports = Update;
