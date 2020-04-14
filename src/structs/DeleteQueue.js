const { Message } = require('discord.js');

const Serializable = require('./Serializable.js');
const { isOfBaseType } = require('../util.js');
const { debugLog } = require('../debug.js');

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
        success = false;
        // TODO: Add check for when bot will never be able to delete message
        if (e.code === 10008 /* Unknown message */) {
          debugLog(`Discord returning unknown message for [${message.id}] (${message.edits.length} edits) ${message.editedTimestamp-message.createdTimestamp}ms`);
          let testMessage;
          try {
            testMessage = await message.channel.fetchMessage(message.id);
          } catch(e) {
            debugLog(`Couldn't fetch message [${message.id}]`);
          } finally {
            if (testMessage) this.queue[i] = testMessage;
          }

          /*
          this.queue.pop(i);
          delete this._queue[message.id];
          deleted++;
          */
        } else {
          debugLog(`Unable to delete old message [${message.id}] (${message.edits.length} edits) ${message.editedTimestamp-message.createdTimestamp}ms`, e);
        }
      }
      if (success) {
        debugLog(`Succefully deleted old message [${message.id}] (${message.edits.length} edits) ${message.editedTimestamp-message.createdTimestamp}ms`);
        this.queue.pop(i);
        delete this._queue[message.id];
        deleted++;
      }
    }
    return deleted;
  }
}

module.exports = DeleteQueue;
