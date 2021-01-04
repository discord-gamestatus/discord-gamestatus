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

const { warnLog, debugLog, verboseLog } = require('./debug.js');

const nullError = function(promise, onError) {
  onError ||= debugLog;
  return new Promise((resolve) => {
    promise.then(resolve).catch((err) => {
      onError(err);
      resolve(null);
    })
  })
}

const max = function() {
  let v = 0;
  for (let arg of arguments) {
    if (arg === undefined) return undefined;
    if (arg > v) v = arg;
  }
  return v;
}

module.exports.getLimits = async function(client, user) {
  let limits = { channelLimit: client.config.channelLimit, guildLimit: client.config.guildLimit };
  for (let guildID in client.config.limitRules) {
    const guild = await nullError(client.guilds.fetch(guildID), warnLog);
    if (guild === null) continue;
    const member = await nullError(guild.members.fetch(user, { rest: true, cache: false, force: true }), verboseLog);
    if (member === null) continue;
    const guildRules = client.config.limitRules[guildID];
    for (let roleID in guildRules) {
      /*const role = await nullError(guild.roles.fetch(roleID), warnLog);
      if (role === null) continue;*/
      if (member.roles.cache.has(roleID)) {
        for (let key in limits) {
          limits[key] = max(limits[key], guildRules[roleID][key]);
        }
      }
    }
  }
  return limits;
}
