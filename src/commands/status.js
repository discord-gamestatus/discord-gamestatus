const Update = require('../structs/Update.js');
const isAdmin = require('../checks.js');

const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send(`You must provide a game type (view and search the gamelist with \`!gamelist\`) and IP instead of \`${parts.join(' ')}\``);

  let update = new Update({
    type: parts[0],
    ip: parts[1]
  }, { channel: message.channel }); // TODO: Add message for invalid game

  await update.send(message.client, 0);

  if (message.client.updateCache.has(update.channel)) {
    let old = message.client.updateCache.get(update.channel);
    if (!Array.isArray(old)) old = [old];
    old.push(update);
    await message.client.updateCache.set(update.channel, old);
  } else {
    await message.client.updateCache.set(update.channel, [update]);
  }


  // await message.delete();
}

exports.name = 'status';
exports.call = call;
exports.check = isAdmin;
