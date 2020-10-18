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
const { gameList } = require('../query.js');
const { isAdmin, isDMChannel, combineAny }  = require('../checks.js');

const call = async function(message, parts) {
  let games = await gameList(), gameIterator = games.values();
  let embed = new MessageEmbed({color:0x5555ff}), embedSize = 100, embeds = [], embedI = 0;
  embed.setFooter(++embedI);
  let field = '', key = gameIterator.next(), count = 0;
  let regex = parts.length > 0 ? parts.map(s => new RegExp(s,'i')) : undefined;

  while (!key.done) {
    let game = key.value;
    let match = true;
    if (regex) {
      match = false;
      for (let r of regex) {
        for (let str of game.keys.concat(game.pretty)) {
          if (str.match(r) !== null) {
            match = true;
            break;
          }
        }
      }
    }
    if (match) {
      let value = `${game.pretty} = ${game.keys.map(v => `\`${v}\``).join(', ')}\n`;
      if (field.length + value.length > 1024) {
        if (embedSize + field.length + 3 > 6000) {
          embeds.push(embed);
          embed = new MessageEmbed({color:0x5555ff});
          embed.setFooter(++embedI);
          embedSize = 100;
        }
        embed.addField('_ _', field, false);
        embedSize += field.length+3;
        field = '';
      }
      field += value;
      count += 1;
    }
    key = gameIterator.next();
  }
  if (field.length > 0) embed.addField('_ _', field);
  for (let e of embeds.concat(embed)) {
    e.setTitle(`${count} Available games`);
    await message.channel.send(e);
  }

}

exports.name = 'gamelist';
exports.call = call;
exports.check = combineAny(isAdmin, isDMChannel);
exports.help = 'Output the list of games availabe, searchable with any text';
