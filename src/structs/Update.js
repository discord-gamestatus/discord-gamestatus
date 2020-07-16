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
