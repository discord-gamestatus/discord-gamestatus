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
    }).catch(console.error);
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

if (require.main === module) setupAndStart(process.env, process.argv);

module.exports = {
  setupAndStart,
  start
};
