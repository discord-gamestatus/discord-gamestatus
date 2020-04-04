const Discord = require('discord.js');
const fs = require('fs').promises;
const UpdateCache = require('./structs/UpdateCache.js');
const DeleteQueue = require('./structs/DeleteQueue.js');
const { allSettled, errorWrap } = require('./util.js');
const { setDebugFlag, debugLog, verbooseLog } = require('./debug.js');

const COMMANDS = new Map();
const TICK_COUNT = 30;
var TICK_GENERATOR = undefined;
var TICK = 0, TICK_SECOND = 0;

var PREFIX = '!';
var ADMIN_FLAG = 'ADMINISTRATOR';

async function loadCommands() {
  let files = await fs.readdir('./src/commands');
  for (let file of files) {
    let command = require(`./commands/${file}`);
    console.log(`Loaded command ${command.name}`);
    COMMANDS.set(command.name.toLowerCase(), {call: command.call, check: command.check});
  }
}

const client = new Discord.Client();
client.updateCache = new UpdateCache('_save.json');
client.deleteQueue = new DeleteQueue();

client.on('message', errorWrap(async function(message) {
  if (!message.member || message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  let parts = message.content.substr(PREFIX.length).split(' ');
  if (parts.length === 0) return;
  let command = parts.splice(0, 1)[0].trim().toLowerCase();

  if (COMMANDS.has(command)) {
    debugLog(`${message.author.id} :: ${command} / ${parts.map(v => `"${v}"`).join(', ')}`);

    let cmd = COMMANDS.get(command);

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
  debugLog(`Unkown command ${command}`);
}))

client.on('ready', errorWrap(async function() {
  console.log(`Logged in ${client.user.username} [${client.user.id}]...`);
  let invite = await client.generateInvite('ADMINISTRATOR');
  console.log(`Invite link ${invite}`);
  client.setInterval(() => {
    client.emit('cUpdate');
  }, 2000);
  client.setInterval(() => {
    client.deleteQueue.tryDelete().then(a => a > 0 ? debugLog(`Deleted ${a} old messages`) : null).catch(console.error);
  }, 10000);
  await client.user.setPresence({ status: 'online', game: { type: 'WATCHING', name: 'always 👀'}})
}))

client.on('cUpdate', errorWrap(async function() {
  if (TICK_GENERATOR === undefined) TICK_GENERATOR = client.updateCache.tickIterable(TICK_COUNT);
  let tick = TICK_GENERATOR.next();
  if (tick.done) {
    TICK_GENERATOR = client.updateCache.tickIterable(TICK_COUNT);
    tick = TICK_GENERATOR.next();
  }

  if (TICK >= Number.MAX_SAFE_INTEGER) TICK = 0;
  let r = TICK % TICK_COUNT;
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
}))

async function doUpdate(update, tick) {
  if (Array.isArray(update)) {
    for (let u of update) {
      await u.send(client, tick);
    }
  } else {
    await update.send(client, tick);
  }
}

async function start(config) {
  PREFIX = config.prefix === undefined ? PREFIX : config.prefix;
  ADMIN_FLAG = config.admin_flag === undefined ? ADMIN_FLAG : config.admin_flag;
  setDebugFlag(config.debug, config.verboose);

  debugLog('DEVELOPER LOGS ENABLED');
  verbooseLog('VERBOOSE LOGS ENABLED');
  await loadCommands();
  await client.updateCache.load();
  await client.login(config.key);
  return client;
}

module.exports = start;
