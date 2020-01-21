const call = async function(message, parts) {
  if (parts.length < 1) return await message.channel.send('INVALID'); // TODO: Message

  if (!message.client.updateCache.has(message.guild.id)) return await message.channel.send(`No update message for this guild`);

  let name = parts.join(' '), user = message.author.id;

  let added = true;

  let update = message.client.updateCache.get(message.guild.id);
  if (typeof update.notifications[name] === 'object') {
    if (user in update.notifications[name]) {
      delete update.notifications[name][user];
      if (Object.keys(update.notifications[name]).length === 0) delete update.notifications[name];
      added = false;
    } else {
      update.notifications[name][user] = true;
    }
  } else {
    update.notifications[name] = {};
    update.notifications[name][user] = true;
  }

  console.log(update.serialize());

  await message.delete();
  await message.author.send(`You will ${added ? 'now' : 'no longer'} recieve an update when **${name}** joins/leaves \`${update.ip}\``);
}

exports.name = 'notify';
exports.call = call;
