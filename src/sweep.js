/* The original version of this is taken from discord.js
* https://github.com/discordjs/discord.js/blob/da39e858a1d4bd23a2af2e693024512426615557/src/client/Client.js#L370-L393
*/

const sweepMessages = function(lifetime) {
  if (!lifetime) lifetime = this.options.messageCacheLifetime;
  if (typeof lifetime !== 'number' || isNaN(lifetime)) throw new TypeError('The lifetime must be a number.');
  if (lifetime <= 0) {
    this.emit('debug', 'Didn\'t sweep messages - lifetime is unlimited');
    return -1;
  }

  const updateMessages = Array.from(this.updateCache.flatValues()).map(update => update.message);

  const lifetimeMs = lifetime * 1000;
  const now = Date.now();
  let channels = 0;
  let messages = 0;

  for (const channel of this.channels.cache.values()) {
    if (!channel.messages) continue;
    channels++;

    /* Sweep check is modified to not delete messages being used by updates */
    messages += channel.messages.sweep(
      message => (now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) && !updateMessages.includes(message.id)
    );
  }

  this.emit('debug', `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
  return messages;
};

module.exports = sweepMessages;
