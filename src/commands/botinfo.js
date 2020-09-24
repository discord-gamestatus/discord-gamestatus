const { MessageEmbed } = require('discord.js');

const Package = require('../../package.json');
const { humanDuration } = require('@douile/bot-utilities');

const call = async function(message) {
  const client = message.client;

  const cpuUsage = process.cpuUsage();
  const memoryUsage = process.memoryUsage();

  await message.channel.send(new MessageEmbed({
    title: `${Package.name} info`,
    description: `[${Package.name} v${Package.version}](${Package.homepage}) [Report bugs here](${Package.bugs.url})\n\
    Average ping: ${Math.round(client.ws.ping,2)}ms\n\
    Uptime: ${humanDuration(client.uptime, 1000)}\n\
    Working in ${client.guilds.cache.size} guilds\n\
    Memory usage: ${Math.round(memoryUsage.heapUsed/1024)}kb/${Math.round(memoryUsage.heapTotal/1024)}kb\n\
    CPU time: ${cpuUsage.user + cpuUsage.system}ms\n\
    **Dependencies**\n\
    [NodeJS ${process.version}](https://nodejs.org)\n\
    [discord.js](https://github.com/discordjs/discord.js)\n\
    [gamedig](https://github.com/gamedig/node-gamedig)`,
    timestamp: Date.now()
  }))
}

exports.name = 'botinfo';
exports.call = call;
exports.help = 'Output runtime information';
