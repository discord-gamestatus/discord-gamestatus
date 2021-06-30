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

const Update = require('../structs/Update.js');
const { isAdmin } = require('../checks.js');
const { isValidGame } = require('../query.js');

const call = async function(message, parts) {
  parts = parts.filter(s => s.length > 0);
  if (parts.length < 2) return await message.channel.send(`You must provide a game type (view and search the gamelist with \`${message.client.config.prefix}gamelist\`) and IP instead of \`${parts.join(' ')}\``);
  if (!isValidGame(parts[0])) return await message.channel.send(`\`${parts[0]}\` is not a valid game please check \`${message.client.config.prefix}gamelist\``);

  // Check channel permissions
  const channel = await message.client.channels.fetch(message.channel);  
  const updateCache = message.client.updateCache;

  let update = new Update({
    type: parts[0],
    ip: parts[1]
  }, { channel: channel });

  // Check if this is a valid status message to add
  let error = await updateCache.canAddUpdate(update, message.client);
  if (error !== undefined) {
    await channel.send(error);
    return;
  }

  update._dontAutoSave = true;
  let state = await update.send(message.client, 0);
  if (state.offline === true) {
    const updateMessage = await update.getMessage(message.client);
    if (updateMessage) await updateMessage.delete();
    // No need to delete as update isn't in database yet
    await message.channel.send(`The server (\`${parts[1]}\`) was offline or unreachable`);
    return;
  }
  await updateCache.create(update); 
  update._dontAutoSave = false;
}

exports.name = 'status';
exports.call = call;
exports.check = isAdmin;
exports.help = 'Create a status message, you must provide game and IP\ne.g. `!status csgo 192.168.0.1`';
