const Update = require('../structs/Update.js');
const { isAdmin } = require('../checks.js');
const { isValidGame } = require('../query.js');

const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send(`You must provide a game type (view and search the gamelist with \`!gamelist\`) and IP instead of \`${parts.join(' ')}\``);
  if (!isValidGame(parts[0])) return await message.channel.send(`\`${parts[0]}\` is not a valid game please check \`!gamelist\``);

  let update = new Update({
    type: parts[0],
    ip: parts[1]
  }, { channel: message.channel });

  let state = await update.send(message.client, 0);
  if (state.offline === true) {
    await update._message.delete();
    await message.channel.send(`The server (\`${parts[1]}\`) was offline or unreachable`);
    return;
  }

  if (message.client.updateCache.has(update.channel)) {
    let old = message.client.updateCache.get(update.channel);
    if (!Array.isArray(old)) old = [old];
    old.push(update);
    await message.client.updateCache.set(update.channel, old);
  } else {
    await message.client.updateCache.set(update.channel, [update]);
  }
}

exports.name = 'status';
exports.call = call;
exports.check = isAdmin;
