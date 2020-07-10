const { MessageEmbed } = require('discord.js');

const Package = require('../../package.json');

const call = async function(message) {
  const client = message.client;

  await message.channel.send(new MessageEmbed({
    title: `${Package.name} info`,
    description: `[${Package.name} v${Package.version}](${Package.homepage}) [Report bugs here](${Package.bugs.url})\n\
    Average ping: ${client.ws.ping}ms\n\
    Uptime: ${client.uptime}ms\n\
    Working in ${client.guilds.size} guilds\n\
    **Dependencies**\n\
    [NodeJS v ${process.version}](https://nodejs.org)\n\
    [discord.js](https://github.com/discordjs/discord.js)\n\
    [gamedig](https://github.com/gamedig/node-gamedig)`,
    timestamp: Date.now()
  }))
}

exports.name = 'botinfo';
exports.call = call;
exports.help = 'Output runtime information';
