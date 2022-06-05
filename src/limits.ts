/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2022 Douile

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
import { Guild, Snowflake } from "discord.js-light";

import { warnLog, debugLog, verboseLog } from "./debug";

function nullError<T, E>(
  promise: Promise<T>,
  onError?: (reason: E) => unknown
): Promise<T | null> {
  const reject = onError || debugLog;
  return new Promise((resolve) => {
    promise.then(resolve).catch((err) => {
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

export interface LimitResponse {
  limits: Limit;
  user: Snowflake;
  isDefault: boolean;
}

export interface Limit {
  channelLimit?: number;
  guildLimit?: number;
  activationLimit?: number;
}

// Cache used here as guild member endpoint can be very slow (RIP memory usage)
const limitCache: Map<string, Limit> = new Map();
export async function getUserLimits(
  client: Client,
  user: Snowflake,
  noCache = false
): Promise<LimitResponse> {
  // FIXME: Set activationLimit
  if (limitCache.has(user) && !noCache) {
    return { limits: limitCache.get(user) as Limit, user, isDefault: false };
  }
  const limits: Limit = {
    channelLimit: client.config.channelLimit,
    guildLimit: client.config.guildLimit,
    activationLimit: 0, // TODO: Maybe allow overriding this although it doesn't seem necessary
  };
  let isDefault = true;
  for (const guildID in client.config.limitRules) {
    const guild = await nullError(client.guilds.fetch(guildID), warnLog);
    if (guild === null) continue;
    const member = await nullError(
      guild.members.fetch({ user, cache: true, force: true }),
      verboseLog
    );
    if (member === null) continue;
    const guildRules = client.config.limitRules[guildID];
    for (const roleID in guildRules) {
      const role = await nullError(guild.roles.fetch(roleID), warnLog);
      if (role === null) continue;
      if (role.members.has(member.id) || member.roles.cache.has(roleID)) {
        verboseLog(`[limit] "${member.id}" matched rule`, limits);
        let key: keyof Limit;
        for (key in limits) {
          limits[key] = max(limits[key], guildRules[roleID][key]);
        }
        isDefault = false;
      }
    }
  }
  limitCache.set(user, limits);
  return { limits, user, isDefault };
}

/**
 * Get the limits for a guild
 */
export async function getLimits(
  client: Client,
  guild: Guild,
  noCache = false
): Promise<LimitResponse> {
  const user = await client.updateCache.saveInterface.getGuildActivation(
    guild.id
  );
  if (user) return await getUserLimits(client, user, noCache);
  // FIXME: Temporary back up to guild owner
  const limits = await getUserLimits(client, guild.ownerId, noCache);
  if (!limits.isDefault)
    await client.updateCache.saveInterface.addUserActivation(
      guild.ownerId,
      guild.id
    );
  return limits;
}
