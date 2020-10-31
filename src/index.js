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

const Discord = require('discord.js');
const fs = require('fs').promises;
const UpdateCache = require('./structs/UpdateCache.js');
const { allSettled, errorWrap, isOfBaseType } = require('@douile/bot-utilities');
const { setDebugFlag, debugLog, verbooseLog } = require('./debug.js');

var TICK_GENERATOR = undefined;
var TICK = 0, TICK_SECOND = 0;
const TICK_EVENT = 'updateTick';
const MAX_TICK = Math.min(4294967296, Number.MAX_SAFE_INTEGER);

const INVITE_FLAGS = [ 'VIEW_AUDIT_LOG', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS' ];

const UPDATE_INTERVALS = {};

const client = new Discord.Client({
  apiRequestMethod: 'sequential',
  messageCacheMaxSize: 0,
  disableMentions: 'everyone',
  restTimeOffset: 1000,
  presence: {
    status: 'online',
    activity: {
      type: 'WATCHING',
      name: 'always 👀'
    }
  }
});

Object.defineProperties(client, {
  updateCache: { value: new UpdateCache(`${__dirname}/../_save.json`) },
  commands: { value: new Map() },
  config: { value: {
    prefix: '!',
    tickCount: 30,
    tickTime: 2000,
    owner: undefined,
    adminFlag: 'ADMINISTRATOR',
    channelLimit: undefined,
    guildLimit: undefined,
    allowDuplicates: false,
    supportServer: undefined,
    limitRules: {}
  } }
});

async function loadCommand(file) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name.toLowerCase(), {call: command.call, check: command.check, help: command.help});
  debugLog(`Loaded command ${command.name}`);
}

async function loadCommands() {
  const files = await fs.readdir(`${__dirname}/commands`);
  /* allSettled not used as we don't want to ignore errors */
  await Promise.all(files.map(loadCommand));
}

function readJSONOrEmpty(fileName) {
  return new Promise((resolve) => {
    fs.readFile(fileName, {encoding: 'utf-8'}).then((content) => {
      let data = {};
      try {
        data = JSON.parse(content);
      } catch(e) {
        verbooseLog('Error parsing JSON', e);
      }
      resolve(data);
    }).catch(() => {
      resolve({});
    })
  })
}

async function loadAdditionalConfigs() {
  client.config.limitRules = await readJSONOrEmpty(`${__dirname}/../limit-rules.json`);
  verbooseLog('Limit rules', client.config.limitRules);
}

client.on(Discord.Constants.Events.MESSAGE_CREATE, errorWrap(async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;

  let parts = message.content.substr(client.config.prefix.length).split(' ');
  if (parts.length === 0) return;
  let command = parts.splice(0, 1)[0].trim().toLowerCase();

  if (client.commands.has(command)) {
    debugLog(`${message.author.id} :: ${command} / ${parts.map(v => `"${v}"`).join(', ')}`);

    let cmd = client.commands.get(command);

    if (!(cmd.check instanceof Function) || cmd.check(message)) {
      try {
        await cmd.call(message, parts);
      } catch(e) {
        console.error(`Error running command ${command}\n`, e);
        await message.channel.send('Sorry an error occured, please try again later');
      }
    } else {
      await message.channel.send('Sorry you don\'t have permission to use this command');
    }

    return;
  }
  verbooseLog(`Unkown command ${command}`);
}))

const startIntervals = function() {
  stopIntervals();

  UPDATE_INTERVALS.tick = client.setInterval(() => {
    client.emit(TICK_EVENT);
  }, client.config.tickTime);
}

const stopIntervals = function() {
  for (let key in UPDATE_INTERVALS) {
    client.clearInterval(UPDATE_INTERVALS[key]);
    delete UPDATE_INTERVALS[key];
  }
}

client.on(Discord.Constants.Events.CLIENT_READY, errorWrap(async function() {
  console.log(`Logged in ${client.user.username} [${client.user.id}]...`);
  let invite = await client.generateInvite(INVITE_FLAGS);
  console.log(`Invite link ${invite}`);
  startIntervals();
  if (client.config.owner === undefined) {
    const application = await client.fetchApplication();
    if (application.owner instanceof Discord.User) {
      client.config.owner = application.owner.id;
    } else if (application.owner instanceof Discord.Team) {
      client.config.owner = application.owner.ownerID;
    }
    console.log('No owner override set, bot owner is', client.config.owner);
  }
  await client.user.setPresence({ status: 'online', activity: { type: 'WATCHING', name: `always 👀 | ${client.config.prefix}help` } });
}))

client.on(TICK_EVENT, errorWrap(async function() {
  if (TICK_GENERATOR === undefined) TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
  let tick = TICK_GENERATOR.next();
  if (tick.done) {
    TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
    tick = TICK_GENERATOR.next();
  }

  if (TICK >= MAX_TICK) TICK = 0;
  let r = TICK % client.config.tickCount;
  if (r === 0) TICK_SECOND += 1;
  if (TICK_SECOND >= MAX_TICK) TICK_SECOND = 0;

  TICK += 1;

  let promises = [];
  if (tick.value) {
    for (let update of tick.value) {
      promises.push(doUpdate(update, TICK_SECOND));
    }
  }
  let res = await allSettled(promises);
  if (res.length > 0) verbooseLog(r,  promises.length, res);
}));

client.on(Discord.Constants.Events.RATE_LIMIT, verbooseLog);
client.on(Discord.Constants.Events.DEBUG, verbooseLog);
client.on(Discord.Constants.Events.WARN, verbooseLog);
client.on(Discord.Constants.Events.ERROR, debugLog);
client.on(Discord.Constants.Events.DISCONNECT, (closeEvent) => {
  stopIntervals();
  verbooseLog('[NETWORK] Disconnected from discord API', closeEvent);
});
client.on(Discord.Constants.Events.RECONNECTING, () => {
  verbooseLog('[NETWORK] Attempting to reconnect to discord API');
});
client.on(Discord.Constants.Events.RESUME, (replayed) => {
  startIntervals();
  verbooseLog(`[NETWORK] Resumed connection to discord API (replaying ${replayed} events)`);
});

async function doUpdate(update, tick) {
  if (!Array.isArray(update)) update = [update];
  for (let u of update) {
    if (u._deleted) {
      verbooseLog(`Skipping updating [${u.ID()}]: already deleted`);
      continue; // Don't update already deleted updates
    }
    if (await u.shouldDelete(client)) {
      await client.updateCache.updateRemove(u);
      await u.deleteMessage(client);
      debugLog(`Deleted obselete update ${u.ID()}`);
    } else {
      await u.send(client, tick);
    }
  }
}

async function start(config) {
  setDebugFlag(config.debug, config.verboose);
  /* Override owner, prefix, tickCount, tickTime */
  for (let key in client.config) {
    if (key in config) client.config[key] = config[key];
  }

  verbooseLog('CONFIG', client.config);

  debugLog('DEVELOPER LOGS ENABLED');
  verbooseLog('VERBOOSE LOGS ENABLED');
  await loadCommands();
  await loadAdditionalConfigs();
  await client.updateCache.load();
  await client.updateCache.deleteEmpty();
  if (isOfBaseType(config.dblKey, String) && config.dblKey.length > 0) {
    require('./dblapi.js')(client, config.dblKey);
  }
  await client.login(config.key);
  return client;
}

module.exports = start;
