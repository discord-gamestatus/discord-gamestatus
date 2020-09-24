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
          // Do nothing
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
