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

const { is } = require('@douile/bot-utilities');

const { isAdmin } = require('../checks.js');
const { EMBED_COLOR } = require('../constants.js');

const unknownError = Object.freeze({
  title: 'Error',
  description: 'You must provide a channel ID and message ID, or reply to a status\ne.g. `!statusremove #channel 788958200251299504`',
  color: 0xff0000,
});

const call = async function(message, parts) {
  let channel, deleteMessage;
  if (message.reference?.channelID && message.reference?.guildID && message.reference?.messageID) {
    channel = message.reference.channelID;
    deleteMessage = message.reference.messageID;
  } else {
    if (parts.length < 2) {
      return await message.channel.send({ embed: unknownError });
    }
    channel = is.discordChannel(parts[0]);
    deleteMessage = parts[1];
  }
  if (channel === undefined || deleteMessage === undefined) {
    return await message.channel.send({ embed: unknownError });
  }

  const response = await message.channel.send({ embed: {title: 'Removing status messages', color: EMBED_COLOR }});

  let statuses = await message.client.updateCache.get(channel);

  let count = 0;
  if (statuses) {
    if (!Array.isArray(statuses)) statuses = [statuses];
    const promises = statuses.filter((status) => {
      return status.message === deleteMessage;
    }).map(async (status) => {
      await message.client.updateCache.updateRemove(status);
      await status.deleteMessage(message.client);
    });
    await Promise.all(promises);
    count = promises.length;
  }

  await response.edit({ embed: {title: 'Done', description: `${count} Status updates have been removed`, color: EMBED_COLOR}});
}

exports.name = 'statusremove';
exports.call = call;
exports.check = isAdmin;
exports.help = 'Remove a status message by replying to it, or by giving its channel ID and message ID\nRight click status, press reply to message, and use `!statusremove`\n`!statusmod #channel messageID`';
