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

const { MessageEmbed } = require('discord.js');

const Package = require('../../package.json');
const { humanDuration } = require('@douile/bot-utilities');

const call = async function(message) {
  const client = message.client;

  const memoryUsage = process.memoryUsage();
  let supportLink = '';
  if (client.config.supportServer !== undefined) {
    supportLink = `[Join the support server](${client.config.supportServer})\n`;
  }

  await message.channel.send(new MessageEmbed({
    title: `${Package.name} info`,
    description: `[${Package.name} v${Package.version}](${Package.homepage}) [Report bugs here](${Package.bugs.url})\n${supportLink}\
    Average ping: ${Math.round(client.ws.ping,2)}ms\n\
    Uptime: ${humanDuration(client.uptime, 1000)}\n\
    Working in ${client.guilds.cache.size} guilds\n\
    Memory usage: ${Math.round(memoryUsage.heapUsed/1024)}kb/${Math.round(memoryUsage.heapTotal/1024)}kb\n\
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
