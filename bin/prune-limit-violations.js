#!/usr/bin/env node

"use strict";

/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { Client } = require("pg");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const { readJSONOrEmpty } = require("../dist/utils");

// FIXME: This should be passed to the script
const defaultLimits = Object.freeze({
  channelLimit: 3,
  guildLimit: 3,
  activationLimit: undefined,
});

const statusRemovedMessage = Object.freeze({
  embeds: [
    {
      title: "Status has been removed",
      description:
        "This status message was removed because it exceeded our configured limits.\nThis is done to prevent our bandwidth limits from being exceeded.\n\nIf you self-host our bot you can set your own limits ([instructions on how to do that](https://gamestatus.douile.com/docs/admin)).\nOtherwise you are able to increase the limits on the public bot by donating to our patreon, for more info see our [support server](https://discord.gg/CUefWnZ)",
      color: 0xff0000,
    },
  ],
});

if (!process.env.DISCORD_API_KEY) {
  console.error("You must provide a DISCORD_API_KEY");
  process.exit(1);
}
const rest = new REST({ version: 10 }).setToken(process.env.DISCORD_API_KEY);

const userLimitCache = new Map();
const guildMemberCache = new Map();

let statusesChecked = 0;
let statusesRemoved = 0;
let serversAffected = 0;
let serversChecked = 0;

async function removeStatus(rest, pg, id) {
  const rowResult = await pg.query(
    "SELECT channel_id, message_id FROM statuses WHERE id=$1",
    [id]
  );
  const { channel_id, message_id } = rowResult.rows[0];
  let editPromise = rest.patch(Routes.channelMessage(channel_id, message_id), {
    body: statusRemovedMessage,
  });
  await pg.query("DELETE FROM statuses WHERE id=$1", [id]);
  await editPromise;
}

async function enforceLimits(rest, pg, serverToCheck, limits) {
  statusesChecked += serverToCheck.count;
  serversChecked += 1;
  // TODO: Check channel limits

  // Exceeds the guild limit
  if (!isNaN(limits.guildLimit) && serverToCheck.count > limits.guildLimit) {
    const toRemove = serverToCheck.count - limits.guildLimit;
    for (const id of serverToCheck.ids.slice(0, toRemove)) {
      await removeStatus(rest, pg, id);
    }
    statusesRemoved += toRemove;
    serversAffected += 1;
  }

  // Exceeds activation limit
  limits.activations += 1;
  if (
    !isNaN(limits.activationLimit) &&
    limits.activations > limits.activationLimit
  ) {
    // TODO: Remove this activation, tricky will break limit check
  }
}

async function getGuildMembers(guildId) {
  const cachedMembers = guildMemberCache.get(guildId);
  if (cachedMembers) return cachedMembers;
  const membersObj = {};
  const members = await rest.get(Routes.guildMembers(guildId));
  for (const member of members) {
    membersObj[member.user.id] = member.roles;
  }
  guildMemberCache.set(guildId, membersObj);
  return membersObj;
}

async function resolveLimits(limitRules, userId) {
  for (const guildId in limitRules) {
    const members = await getGuildMembers(guildId);
    if (userId in members) {
      for (const roleId in limitRules[guildId]) {
        if (members[userId].contains(roleId)) {
          return Object.assign({ activations: 0 }, limitRules[guildId][roleId]);
        }
      }
    }
  }
  return Object.assign({ activations: 0 }, defaultLimits);
}

function createServerChecker(rest, pg, limitRules) {
  return async (serverToCheck) => {
    console.log(serverToCheck);

    if (!serverToCheck.user_id) {
      const guildInfo = await rest.get(Routes.guild(serverToCheck.guild_id));
      console.log(guildInfo);
      serverToCheck.user_id = guildInfo.owner_id;
    }

    let limits = userLimitCache.get(serverToCheck.user_id);
    if (!limits) {
      limits = await resolveLimits(limitRules, serverToCheck.user_id);
      userLimitCache.set(serverToCheck.user_id, limits);
    }
    await enforceLimits(rest, pg, serverToCheck, limits);
  };
}

(async function () {
  const limitRules = await readJSONOrEmpty(
    path.join(__dirname, "../limit-rules.json")
  );

  if (Object.keys(limitRules).length === 0) {
    console.log("There are no limit rules to enforce");
    return;
  }

  console.error("Limits to enforce", limitRules);

  const pg = new Client({
    database: process.env.PG_DATABASE || "discord_gamestatus",
  });
  await pg.connect();

  console.error("Connected to database...");

  const result = await pg.query(
    "SELECT ids, count::INT, guild_id, user_id FROM status_counts_per_server_with_activation"
  );

  // Start transaction
  await pg.query("BEGIN");

  await Promise.all(result.rows.map(createServerChecker(rest, pg, limitRules)));

  // Close transaction
  await pg.query("COMMIT");
  await pg.end();

  // Print stats
  console.log(
    `Removed ${statusesRemoved}/${statusesChecked} statuses on ${serversAffected}/${serversChecked} guilds`
  );
})().then(null, console.error);
