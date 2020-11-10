/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2020 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { isOfBaseType } = require('@douile/bot-utilities');

const { Update } = require('../structs/Update.js');

const call = async function(message, parts) {
  if (!message.client.updateCache.has(message.channel.id)) return await message.channel.send(`No update message for this channel`);

  let added = true;
  let update = message.client.updateCache.get(message.channel.id);
  if (isOfBaseType(update, Array)) {
    if (update.length === 1) {
      update = update[0];
    } else {
      return await message.channel.send('Sorry the notify command is disabled for multistatus channels'); // NOTE: Players cannot disable notifications after there are multiple statuses
    }
  } else if (!isOfBaseType(update, Update)) {
    console.error('Bad update type', update);
    return; // Ahhh something has gone wrong
  }

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
exports.check = function() { return false; }
exports.call = call;
exports.help = 'Toggle DM notifications for the specified player, or if left blank the server';
