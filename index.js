#!/usr/bin/env node

const start = require('./src/index.js');

let dev = false;
let config = {
  key: process.env.DISCORD_API_KEY,
  debug: false,
  verboose: false
};

for (let i=0;i<process.argv.length;i++) {
  switch(process.argv[i]) {
    case '-d':
    case '--debug':
    config.debug = true;
    break;
    case '-v':
    case '--verboose':
    config.verboose = true;
    break;
    case '--dev':
    dev = true;
    break;
    case '-p':
    case '--prefix':
    config.prefix = process.argv[++i];
    break;
    case '--key':
    config.key = process.argv[++i];
    break;
    case '--owner':
    config.owner = process.argv[++i];
    break;
    case '--tick-count':
    config.tickCount = Number(process.argv[++i]);
    break;
    case '--tick-time':
    config.tickTime = Number(process.argv[++i]);
    break;
  }
}

if (!dev) return start(config).then(null).catch(console.error);

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

process.on('beforeExit', async function() {
  if (stop) await stop();
})

devStart().then(null).catch(console.error);
