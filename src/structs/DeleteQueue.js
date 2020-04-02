const { Message } = require('discord.js');

const Serializable = require('./Serializable.js');
const { isOfBaseType } = require('../util.js');

// TODO: Save the queue data for when bot restarts
class DeleteQueue extends Serializable {
  constructor() {
    super();
    this.queue = new Array();
    this._queue = {};
  }

  add(message) {
    if (!isOfBaseType(message, Message)) return;
    this.queue.push(message);
    this._queue[message.id] = 1;
  }

  count() {
    return this.queue.length;
  }

  async tryDelete() {
    let deleted = 0;
    for (let i=this.queue.length-1;i>=0;i--) {
      let message = this.queue[i];
      let success = true;
      try {
        await message.delete();
      } catch(e) {
        // TODO: Add check for when bot will never be able to delete message
        success = false;
      }
      if (success) {
        this.queue.pop(i);
        delete this._queue[message.id];
        deleted++;
      }
    }
    return deleted;
  }
}

module.exports = DeleteQueue;
