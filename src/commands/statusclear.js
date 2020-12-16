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

const { allSettled } = require('@douile/bot-utilities');

const { isAdmin } = require('../checks.js');
const { channelFirstArg } = require('../utils.js');

const call = async function(message) {
  let response = await message.channel.send('Clearing status updates...');
  let channel;
  try {
    channel = await channelFirstArg(message, args);
  } catch {
    return;
  }

  let statuses = message.client.updateCache.get(channel.id);

  let count = 0;
  if (statuses) {
    if (!Array.isArray(statuses)) statuses = [statuses];
    let promises = statuses.map((status) => {
      status._deleted = true;
      return status.deleteMessage(message.client);
    });
    await allSettled(promises);
    count = statuses.length;
  }

  await message.client.updateCache.delete(channel.id);
  await response.edit(`${count} Status updates have been cleared`);
}

exports.name = 'statusclear';
exports.call = call;
exports.check = isAdmin;
exports.help = 'Clear all status messages from the channel';
