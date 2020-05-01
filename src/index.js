const Discord = require('discord.js');
const fs = require('fs').promises;
const UpdateCache = require('./structs/UpdateCache.js');
const DeleteQueue = require('./structs/DeleteQueue.js');
const { allSettled, errorWrap } = require('./util.js');
const { setDebugFlag, debugLog, verbooseLog } = require('./debug.js');

var TICK_GENERATOR = undefined;
var TICK = 0, TICK_SECOND = 0;
const TICK_EVENT = 'updateTick';

const INVITE_FLAGS = [ 'ADMINISTRATOR' ];

const UPDATE_INTERVALS = {};

Discord.Client.prototype.sweepMessages = require('./sweep.js');
const client = new Discord.Client({
  apiRequestMethod: 'sequential',
  messageCacheMaxSize: -1, /* Use custom sweep */
  messageCacheLifetime: 90,
  messageSweepInterval: 90,
  disableEveryone: true,
  restTimeOffset: 1200,
  disabledEvents: [ 'TYPING_START', 'VOICE_STATE_UPDATE', 'VOICE_SERVER_UPDATE', 'WEBHOOKS_UPDATE' ],
  ws: {
    compress: true
  }
});

Object.defineProperties(client, {
  updateCache: { value: new UpdateCache('_save.json') },
  deleteQueue: { value: new DeleteQueue() },
  commands: { value: new Map() },
  config: { value: {
    prefix: '!',
    tickCount: 30,
    tickTime: 2000,
    owner: '293482190031945739'
  } }
});

async function loadCommand(file) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name.toLowerCase(), {call: command.call, check: command.check});
  console.log(`Loaded command ${command.name}`);
}

async function loadCommands() {
  const files = await fs.readdir('./src/commands');
  /* allSettled not used as we don't want to ignore errors */
  await Promise.all(files.map(loadCommand));
}

client.on(Discord.Constants.Events.MESSAGE_CREATE, errorWrap(async function(message) {
  if (!message.member || message.author.bot) return;
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

  UPDATE_INTERVALS.delete = client.setInterval(() => {
    client.deleteQueue.tryDelete().then(a => a > 0 ? debugLog(`Deleted ${a} old messages`) : null).catch(console.error);
  }, 10000);
}

const stopIntervals = function() {
  for (let key in UPDATE_INTERVALS) {
    client.clearInterval(UPDATE_INTERVALS[key]);
    delete UPDATE_INTERVALS[key];
  }
}

client.on(Discord.Constants.Events.READY, errorWrap(async function() {
  console.log(`Logged in ${client.user.username} [${client.user.id}]...`);
  let invite = await client.generateInvite(INVITE_FLAGS);
  console.log(`Invite link ${invite}`);
  startIntervals();
  await client.user.setPresence({ status: 'online', game: { type: 'WATCHING', name: 'always 👀'}})
}))

client.on(TICK_EVENT, errorWrap(async function() {
  if (TICK_GENERATOR === undefined) TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
  let tick = TICK_GENERATOR.next();
  if (tick.done) {
    TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
    tick = TICK_GENERATOR.next();
  }

  if (TICK >= Number.MAX_SAFE_INTEGER) TICK = 0;
  let r = TICK % client.config.tickCount;
  if (r === 0) TICK_SECOND += 1;
  if (TICK_SECOND >= Number.MAX_SAFE_INTEGER) TICK_SECOND = 0;

  TICK += 1;

  let promises = [];
  if (tick.value) {
    for (let update of tick.value) {
      promises.push(doUpdate(update, TICK_SECOND));
    }
  }
  let res = await allSettled(promises);
  verbooseLog(r,  promises.length, res);
}));

client.on(Discord.Constants.Events.RATE_LIMIT, debugLog);
client.on(Discord.Constants.Events.DEBUG, verbooseLog);
client.on(Discord.Constants.Events.WARN, verbooseLog);
client.on(Discord.Constants.Events.ERROR, debugLog);
client.on(Discord.Constants.Events.DISCONNECT, (closeEvent) => {
  stopIntervals();
  console.warn('[NETWORK] Disconnected from discord API', closeEvent);
});
client.on(Discord.Constants.Events.RECONNECTING, () => {
  console.log('[NETWORK] Attempting to reconnect to discord API');
});
client.on(Discord.Constants.Events.RESUME, (replayed) => {
  startIntervals();
  debugLog(`[NETWORK] Resumed connection to discord API (replaying ${replayed} events)`);
});

async function doUpdate(update, tick) {
  if (!Array.isArray(update)) update = [update];
  for (let u of update) {
    if (await u.shouldDelete(client)) {
      /* This could break due to asyncronous */
      const ID = u.ID();
      const channel = client.updateCache.get(u.channel).filter(v => v.ID() !== ID);
      await client.updateCache.set(u.channel, channel);
      debugLog(`Deleted obselete update ${ID}`);
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

  debugLog('DEVELOPER LOGS ENABLED');
  verbooseLog('VERBOOSE LOGS ENABLED');
  await loadCommands();
  await client.updateCache.load();
  await client.login(config.key);
  return client;
}

module.exports = start;
