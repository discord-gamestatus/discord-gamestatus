const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send('INVALID'); // TODO: Message

  if (!message.client.updateCache.has(message.channel.id)) return await message.channel.send(`No update message for this channel`);

  let user = parts.splice(0,1)[0];
  let name = parts.join(' ');

  let added = true;

  let update = message.client.updateCache.get(message.channel.id);
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

  let client = await message.client.fetchUser(user);

  await message.delete();
  await client.send(`You will ${added ? 'now' : 'no longer'} recieve an update when **${name}** joins/leaves \`${update.ip}\``);
  await message.client.updateCache.save();
}

exports.name = 'notifyfor';
exports.call = call;
