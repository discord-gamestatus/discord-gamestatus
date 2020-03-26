const { isOfBaseType } = require('../util.js');

const call = async function(message, parts) {
  if (!message.client.updateCache.has(message.channel.id)) return await message.channel.send(`No update message for this channel`);

  let added = true;
  let update = message.client.updateCache.get(message.channel.id);
  let user = message.author.id, name;

  if (parts.length < 1) {
    // UPDATE For server
    name = update.name;

    if (isOfBaseType(update.notifyServer, Object)) {
      if (user in update.notifyServer) {
        delete update.notifyServer[user];
        if (Object.keys(update.notifyServer).length === 0) delete update.notifyServer;
        added = false;
      } else {
        update.notifyServer[user] = 1;
      }
    } else {
      update.notifyServer = {};
      update.notifyServer[user] = 1;
    }

  } else {
    // UPDATE For clients

    name = parts.join(' ');

    if (isOfBaseType(update.notifications[name], Object)) {
      if (user in update.notifications[name]) {
        delete update.notifications[name][user];
        if (Object.keys(update.notifications[name]).length === 0) delete update.notifications[name];
        added = false;
      } else {
        update.notifications[name][user] = 1;
      }
    } else {
      update.notifications[name] = {};
      update.notifications[name][user] = 1;
    }
  }

  console.log(update.serialize());

  await message.delete();
  await message.author.send(`You will ${added ? 'now' : 'no longer'} recieve an update when **${name}** ${parts.length < 1 ? 'updates' : 'joins/leaves' } \`${update.ip}\``);
  await message.client.updateCache.save();
}

exports.name = 'notify';
exports.call = call;
