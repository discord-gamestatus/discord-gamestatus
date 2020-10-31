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

const { isOfBaseType } = require('@douile/bot-utilities');

const { EMBED_COLOR } = require('../constants.js');

const matchAny = function(text, search) {
  for (let s of search) {
    if (text.match(s) !== null) return true;
  }
  return false;
}

const call = async function(message, parts) {
  const search = parts.map(s => new RegExp(s, 'gi'));
  if (search.length === 0) {
    await message.channel.send(new MessageEmbed({
      title: 'Help',
      color: EMBED_COLOR,
      description: Array.from(message.client.commands.entries())
        .filter(cmd => cmd[0] !== 'help' && (isOfBaseType(cmd[1].check, Function) ? cmd[1].check(message) : true))
        .map(cmd => `\`${message.client.config.prefix}${cmd[0]}\``)
        .join('\n'),
      footer: { text: `Use "${message.client.config.prefix}help commandName" for detailed help` }
    }));
  } else {
    await message.channel.send(new MessageEmbed({
      title: 'Help',
      color: EMBED_COLOR,
      fields: Array.from(message.client.commands.entries())
        .filter(cmd => matchAny(`${message.client.config.prefix}${cmd[0]}`, search) && (isOfBaseType(cmd[1].check, Function) ? cmd[1].check(message) : true))
        .map(cmd => {
          return {
            name: `${message.client.config.prefix}${cmd[0]}`,
            value: isOfBaseType(cmd[1].help, String) ? cmd[1].help : 'No help message provided',
            inline: false
          };
        })
    }));
  }
}

exports.name = 'help';
exports.call = call;
