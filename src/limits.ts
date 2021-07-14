/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2021 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import Client from "./structs/Client";
import { Snowflake } from "discord.js-light";

import { warnLog, debugLog, verboseLog } from "./debug";

function nullError<T>(
  promise: Promise<T>,
  onError?: Function
): Promise<T | null> {
  const reject = onError || debugLog;
  return new Promise(resolve => {
    promise.then(resolve).catch(err => {
      reject(err);
      resolve(null);
    });
  });
}

function max(a?: number, b?: number): number | undefined {
  if (!a) return b;
  if (!b) return a;
  if (a > b) return a;
  return b;
}

export interface Limit {
  channelLimit?: number;
  guildLimit?: number;
}

// Cache used here as guild member endpoint can be very slow (RIP memory usage)
const limitCache: Map<string, Limit> = new Map();
export async function getLimits(
  client: Client,
  user: Snowflake,
  noCache: boolean = false
) {
  if (limitCache.has(user) && !noCache) {
    return limitCache.get(user);
  }
  let limits: Limit = {
    channelLimit: client.config.channelLimit,
    guildLimit: client.config.guildLimit
  };
  for (let guildID in client.config.limitRules) {
    const guild = await nullError(client.guilds.fetch(guildID), warnLog);
    if (guild === null) continue;
    const member = await nullError(
      guild.members.fetch(user, { rest: true, cache: false, force: true }),
      verboseLog
    );
    if (member === null) continue;
    const guildRules = client.config.limitRules[guildID];
    for (let roleID in guildRules) {
      /*const role = await nullError(guild.roles.fetch(roleID), warnLog);
      if (role === null) continue;*/
      if (member.roles.cache.has(roleID)) {
        let key: keyof Limit;
        for (key in limits) {
          limits[key] = max(
            limits[key],
            guildRules[roleID][key]
          );
        }
      }
    }
  }
  limitCache.set(user, limits);
  return limits;
}
