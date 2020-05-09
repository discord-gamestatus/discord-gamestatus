const { isAdmin } = require('../checks.js');

const call = async function(message) {
  let statuses = message.client.updateCache.get(message.channel.id);

  let count = 0;
  if (statuses) {
    if (!Array.isArray(statuses)) statuses = [statuses];
    for (let status of statuses) {
      const statusMessage = await status.getMessage(message.client);
      if (statusMessage) {
        try {
          await statusMessage.delete();
        } catch(e) {
          message.client.deleteQueue.tryDelete(statusMessage);
        }
      }
    }
    count = statuses.length;
  }

  message.client.updateCache.delete(message.channel.id);
  await message.channel.send(`${count} Status updates have been cleared`);
}

exports.name = 'statusclear';
exports.call = call;
exports.check = isAdmin;
exports.help = 'Clear all status messages from the channel';
