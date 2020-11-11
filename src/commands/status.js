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
// const { STATUS_PERMISSIONS } = require('../constants.js');
const { debugLog } = require('../debug.js');
// const STATUS_PERMISSIONS_READABLE = STATUS_PERMISSIONS.map(p => `\`${p}\``).join(', ');


const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send(`You must provide a game type (view and search the gamelist with \`${message.client.config.prefix}gamelist\`) and IP instead of \`${parts.join(' ')}\``);
  if (!isValidGame(parts[0])) return await message.channel.send(`\`${parts[0]}\` is not a valid game please check \`${message.client.config.prefix}gamelist\``);

  // Check channel permissions
  const channel = await message.client.channels.fetch(message.channel);
  /*
  const permissions = channel.permissionsFor(message.client.user);
  if (permissions !== null) {
    if (!permissions.has(STATUS_PERMISSIONS, true)) {
      const errorMessage = `It doesn't look like I have enough permissions to create a status message in this channel. Please check <@!${message.client.user.id}> has ${STATUS_PERMISSIONS_READABLE} in this channel (<#${message.channel.id}>)`;
      try {
        await message.channel.send(errorMessage);
      } catch(e) {
        // DM user
        await message.author.send(errorMessage);
      }
      return;
    }
  }
  */

  let update = new Update({
    type: parts[0],
    ip: parts[1]
  }, { channel: channel });

  let state = await update.send(message.client, 0);
  if (state.offline === true) {
    const message = await update.getMessage(client);
    if (message) await message.delete();
    await message.channel.send(`The server (\`${parts[1]}\`) was offline or unreachable`);
    return;
  }

  /*
  Here we do most of the validation checks for adding a new update in UpdateCache.updateAdd
  This is because this function can be used elsewhere, and also due to the fact
  this function already locks the key and retrieves necessary data to do the checks
  */
  let error;
  try {
    error = await message.client.updateCache.updateAdd(update, message.client);
  } catch(e) {
    const message = await update.getMessage(client);
    if (message) await message.delete();
    await channel.send('Sorry an error was encountered saving this update, please try again later');
    debugLog(e);
    return;
  }

  if (error !== undefined) {
    const message = await update.getMessage(client);
    if (message) await message.delete();
    await channel.send(error);
  }
}

exports.name = 'status';
exports.call = call;
exports.check = isAdmin;
exports.help = 'Create a status message, you must provide game and IP\ne.g. `!status csgo 192.168.0.1`';
