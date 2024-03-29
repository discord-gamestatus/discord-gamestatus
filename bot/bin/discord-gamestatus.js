#!/usr/bin/env node

"use strict";

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

const USAGE = function () {
  console.log(
    '\
discord-gamestatus: A discord bot that monitors game servers\nhttps://github.com/Douile/discord-gamestatus\n\
Usage:\n\
\t-d, --debug\t\t\tEnable debug logging\n\
\t-v, --verbose\t\t\tEnable verbose logging\n\
\t--no-info\t\t\tDisable info logging\n\
\t--no-warn\t\t\tDisable warning logging\n\
\t--no-error\t\t\tDisable error logging\n\
\t--dev\t\t\t\tEnable dev mode (monitor files for changes and auto-restart)\n\
\t-p [prefix], --prefix [prefix]\tChange the command prefix can be any length (--prefix "_")\n\
\t--key [key]\t\t\tSet the discord API key (Use of env var recommended)\n\
\t--owner [owner]\t\t\tSet the bot owner user ID\n\
\t--admin [permissions]\t\tSet the guild permissions required to be bot admin\n\
\t--dbl-key [key]\t\t\tSet top.gg API key (Use of env var recommended)\n\
\t--tick-count [count]\t\tSet the number of ticks (Each update is assigned a tick so no. ticks is maximum time between a single update)\n\
\t--tick-time [time]\t\tSet the time between each tick (in ms)\n\
\t--channel-limit [limit]\t\tThe max amount of statuses per channel (0 / not set = infinite)\n\
\t--guild-limit [limit]\t\tThe max amount of statuses per guild (0 / not set = infinite)\n\
\t--allow-duplicate-updates\tAllow guilds to have multiple statuses for the same IP\n\
\t--support [link]\t\tLink to the support server\n\
\t--scheduler [address]\t\tAddress of the support server\n\
\t--dont-block-local-addresses\tDon\'t block statuses on local IPs\n\
\t--query-timeout [timeout]\tQuery timeout (in milliseconds)\n\
\t-h, --help\t\t\tShow this help message'
  );
};

require("dotenv").config();
const start = require("..").default;

//import dotenv from "dotenv";
//import start from "../dist/index";
//
//dotenv.config();

function asNumberOrUndefined(value) {
  if (value) {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function nonEmptyStringOrUndefined(value) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return undefined;
}

const setupAndStart = function (env, args) {
  let dev = false;
  let config = {
    key: nonEmptyStringOrUndefined(env.DISCORD_API_KEY),
    error: true,
    warn: true,
    info: true,
    debug: false,
    verbose: false,
    dblKey: nonEmptyStringOrUndefined(env.TOPGG_API_KEY),
    database: nonEmptyStringOrUndefined(env.PG_DATABASE),
    prefix: nonEmptyStringOrUndefined(env.GS_PREFIX),
    adminFlag: nonEmptyStringOrUndefined(env.GS_ADMIN_FLAG),
    tickCount: asNumberOrUndefined(env.GS_TICK_COUNT),
    tickTime: asNumberOrUndefined(env.GS_TICK_TIME),
    channelLimit: asNumberOrUndefined(env.GS_CHANNEL_LIMIT),
    guildLimit: asNumberOrUndefined(env.GS_GUILD_LIMIT),
    supportServer: nonEmptyStringOrUndefined(env.GS_SUPPORT_LINK),
    scheduler: nonEmptyStringOrUndefined(env.GS_SCHEDULER_ADDR),
    queryTimeout: asNumberOrUndefined(env.GS_QUERY_TIMEOUT),
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-v":
      case "--verbose":
      case "--verboose":
        config.verbose = true;
      case "-d":
      case "--debug":
        config.debug = true;
        break;

      case "--no-info":
        config.info = false;
        break;

      case "--no-error":
        config.error = false;
      case "--no-warn":
        config.warn = false;
        break;

      case "--dev":
        dev = true;
        break;
      case "-p":
      case "--prefix":
        config.prefix = args[++i];
        break;
      case "--key":
        config.key = args[++i];
        break;
      case "--owner":
        config.owner = args[++i];
        break;
      case "--admin":
        config.adminFlag = args[++i];
        break;
      case "--topgg-key":
      case "--dbl-key":
        config.dblKey = args[++i];
        break;
      case "--tick-count":
        config.tickCount = asNumberOrUndefined(args[++i]);
        break;
      case "--tick-time":
        config.tickTime = asNumberOrUndefined(args[++i]);
        break;
      case "--channel-limit":
        config.channelLimit = asNumberOrUndefined(args[++i]);
        break;
      case "--guild-limit":
        config.guildLimit = asNumberOrUndefined(args[++i]);
        break;
      case "--allow-duplicate-updates":
        config.allowDuplicates = true;
        break;
      case "--support":
        config.supportServer = args[++i];
        break;
      case "--scheduler":
        config.scheduler = args[++i];
        break;
      case "--dont-block-local-addresses":
        config.blockLocalAddresses = false;
        break;
      case "--query-timeout":
        config.queryTimeout = asNumberOrUndefined(args[++i]);
        break;
      case "-h":
      case "--help":
        USAGE();
        process.exit();
    }
  }

  if (!dev) {
    start(config)
      .then((client) => {
        let hasShutdown = false;
        const shutdown = function () {
          if (hasShutdown) return;
          hasShutdown = true;
          const shardCount = client.ws.shards.size;
          console.log(`Shutting down ${shardCount} shards`);
          let shardsDestroyed = 0,
            closed = false;
          client.on("shardDisconnect", function () {
            if (++shardsDestroyed >= shardCount && !closed) {
              closed = true;
              console.log("All shards closing update cache");
              client.updateCache
                .close()
                .then(() => process.exit(0))
                .catch((err) => {
                  console.error(err);
                  process.exit(50);
                });
            }
          });
          client.destroy();
        };
        process.once("SIGINT", shutdown);
        process.once("SIGTERM", shutdown);
        process.once("beforeExit", shutdown);
      })
      .catch(function () {
        console.error.apply(this, arguments);
        process.exit(1);
      });
  } else {
    const fs = require("fs");
    let stop,
      restarting = false;

    fs.watch("src", { recursive: true }, async function () {
      if (restarting) return;
      console.log("\nRestarting\n==========");
      restarting = true;
      if (stop) await stop();
      stop = undefined;
      await devStart();
      restarting = false;
    });

    const devStart = async function () {
      Object.keys(require.cache).forEach((key) => delete require.cache[key]);
      let startFunc = require("./src/index.js"),
        client;
      try {
        client = await startFunc(config);
      } catch (e) {
        console.log(e);
        return await devStart();
      }
      client.on("warn", console.warn);
      client.on("error", console.error);
      stop = client.destroy.bind(client);
    };

    let hasShutdown = false;
    const shutdown = async function () {
      if (hasShutdown) return;
      hasShutdown = true;
      console.log("Shutting down...");
      if (stop) await stop();
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
    process.once("beforeExit", shutdown);

    devStart().then(null).catch(console.error);
  }
};

if (require.main === module) {
  console.log(
    "This program is licensed under GPL-3.0 a license should be included in LICENSE or can be found at https://github.com/Douile/discord-gamestatus/blob/master/LICENSE"
  );
  setupAndStart(process.env, process.argv);
}

module.exports = {
  setupAndStart,
  start,
};
