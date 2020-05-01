const isAdmin = require('../checks.js');

const call = async function(message) {
  let statuses = message.client.updateCache.get(message.channel.id);

  let count = 0;
  if (statuses) {
    if (!Array.isArray(statuses)) statuses = [statuses];
    for (let status of statuses) {
      let message = await status.getMessage();
      if (message) {
        try {
          await message.delete();
        } catch(e) {
          message.client.deleteQueue.tryDelete(message);
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
