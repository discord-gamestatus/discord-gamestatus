const start = require('./src/index.js');

let config = {
  prefix: '!',
  key: process.env.DISCORD_API_KEY
};

start(config).then(null).catch(console.error);
