/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2021 Douile

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
const { EMBED_COLOR } = require('../constants.js');
const { channelFirstArg } = require('../utils.js');

const call = async function(message) {
  const args = message.content.split(' ').splice(1);

  let channel;
  try {
    channel = await channelFirstArg(message, args);
  } catch {
    return;
  }

  if (!channel) return;

  let statuses = await message.client.updateCache.get({channel: channel.id});
  if (statuses === undefined) {
    statuses = [];
  } else if (!Array.isArray(statuses)) {
    statuses = [statuses];
  }

  if (statuses.length === 0) {
    return await message.channel.send({ embed: {
      title: 'Error',
      description: `No statuses in the channel <#${channel.id}>`,
      color: 0xff0000,
    }});
  }

  const res = await message.channel.send({ embed: {
    title: 'Working...',
    description: `Refreshing ${statuses.length} updates`,
    color: EMBED_COLOR,
  }});

  for (let status of statuses) {
    await status.deleteMessage(message.client);
    await status.setMessage(message.client); // Clear message
  }

  await res.edit({ embed: {
    title: 'Done',
    description: `Refreshed ${statuses.length} updates`,
    color: EMBED_COLOR,
  }})
}

exports.name = 'statusrefresh';
exports.call = call;
exports.check = isAdmin;
