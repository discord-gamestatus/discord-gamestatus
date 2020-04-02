const start = require('./src/index.js');

let debug = process.argv.includes('--debug') || process.argv.includes('-d');
let verboose = process.argv.includes('--verboose') || process.argv.includes('-v');
let dev = process.argv.includes('--dev');

let config = {
  prefix: '!',
  key: process.env.DISCORD_API_KEY,
  debug: debug,
  verboose: verboose
};

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
