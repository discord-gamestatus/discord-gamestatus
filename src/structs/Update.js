const Serializable = require('./Serializable.js');
const generateEmbed = require('../embed.js');
const connectDiff = require('../connectDiff.js');
const { query } = require('../query.js');
let boundQuery;

class Update extends Serializable {
  constructor(opts, objs) {
    super();

    this.guild = opts.guild;
    this.channel = opts.channel;
    this.message = opts.message;
    this.players = null;
    this.type = opts.type;
    this.ip = opts.ip;

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

  async send(client, tick) {
    if (!tick) tick = 0;

    let prevPlayers = this.players;
    if (!boundQuery) boundQuery = query.bind(client);
    let state = await boundQuery(this.type, this.ip);
    this.players = state.realPlayers ? state.realPlayers.map(v => v.name) : null;

    let embed = generateEmbed(state, tick);
    let diff = connectDiff(this.players, prevPlayers);

    let args = [diff.length > 0 ? diff.join('\n') : '', embed];

    let message = await this.getMessage(client);
    if (message) {
      return await message.edit.apply(message, args);
    }

    let channel = await this.getChannel(client);
    if (channel) {
      message = await channel.send.apply(channel, args);
      this._message = message;
      this.message = message.id;
      return;
    }
  }
}

module.exports = Update;
