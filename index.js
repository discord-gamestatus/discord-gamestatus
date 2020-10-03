'use strict';

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

const start = require('./src/index.js');

const setupAndStart = function(env, args) {
  let dev = false;
  let config = {
    key: env.DISCORD_API_KEY,
    debug: false,
    verboose: false,
    dblKey: env.TOPGG_API_KEY,
  };

  for (let i=0;i<args.length;i++) {
    switch(args[i]) {
      case '-d':
      case '--debug':
      config.debug = true;
      break;
      case '-v':
      case '--verbose':
      case '--verboose':
      config.verboose = true;
      break;
      case '--dev':
      dev = true;
      break;
      case '-p':
      case '--prefix':
      config.prefix = args[++i];
      break;
      case '--key':
      config.key = args[++i];
      break;
      case '--owner':
      config.owner = args[++i];
      break;
      case '--admin':
      config.adminFlag = args[++i];
      break;
      case '--topgg-key':
      case '--dbl-key':
      config.dblKey = args[++i];
      break;
      case '--tick-count':
      config.tickCount = Number(args[++i]);
      break;
      case '--tick-time':
      config.tickTime = Number(args[++i]);
      break;
      case '--channel-limit':
      config.channelLimit = Number(args[++i]);
      break;
      case '--guild-limit':
      config.guildLimit = Number(args[++i]);
      break;
      case '--allow-duplicate-updates':
      config.allowDuplicates = true;
      break;
      case '-h':
      case '--help':
      console.log('discord-gamestatus: A discord bot that monitors game servers\nhttps://github.com/Douile/discord-gamestatus\n\
      Usage:\n\
      \t-d, --debug\t\t\tEnable debug logging\n\
      \t-v, --verbose\t\t\tEnable verbose logging\n\
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
      \t-h, --help\t\t\tShow this help message');
      process.exit();
      break;
    }
  }

  if (!dev) {
    start(config).then((client) => {
      let hasShutdown = false;
      const shutdown = async function() {
        if (hasShutdown) return;
        hasShutdown = true;
        console.log('Shutting down...');
        await client.destroy();
      }
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
      process.once('beforeExit', shutdown);
    }).catch(function() {
      console.error.apply(this, arguments);
      process.exit(1);
    });
  } else {
    const fs = require('fs');
    let stop, restarting = false;

    fs.watch('src', { recursive: true }, async function() {
      if (restarting) return;
      console.log('\nRestarting\n==========');
      restarting = true;
      if (stop) await stop();
      stop = undefined;
      await devStart();
      restarting = false;
    });

    const devStart = async function() {
      Object.keys(require.cache).forEach((key) => delete require.cache[key]);
      let startFunc = require('./src/index.js'), client;
      try {
        client = await startFunc(config);
      } catch(e) {
        console.log(e);
        return await devStart();
      }
      client.on('warn', console.warn);
      client.on('error', console.error);
      stop = client.destroy.bind(client);
    }

    let hasShutdown = false;
    const shutdown = async function() {
      if (hasShutdown) return;
      hasShutdown = true;
      console.log('Shutting down...');
      if (stop) await stop();
    }

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    process.once('beforeExit', shutdown);

    devStart().then(null).catch(console.error);
  }
}

if (require.main === module) {
  console.log('This program is licensed under GPL-3.0 a license should be included in LICENSE or can be found at https://github.com/Douile/discord-gamestatus/blob/master/LICENSE');
  setupAndStart(process.env, process.argv);
}

module.exports = {
  setupAndStart,
  start
};
