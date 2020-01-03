const Update = require('../structs/Update.js');

const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send('You must provide a game type and IP');

  let update = new Update({
    type: parts[0],
    ip: parts[1]
  }, { channel: message.channel });

  await update.send(message.client, 0);

  message.client.updateCache.set(update.guild, update);
}

exports.name = 'status';
exports.call = call;
