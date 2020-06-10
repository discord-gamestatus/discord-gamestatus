const { MessageEmbed } = require('discord.js');
const { gameList } = require('../query.js');
const isAdmin = require('../checks.js');

const call = async function(message, parts) {
  let games = await gameList(), gameIterator = games.values();
  let embed = new MessageEmbed(), embedSize = 100, embeds = [], embedI = 0;
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
          embed = new MessageEmbed();
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
exports.check = isAdmin;
exports.help = 'Output the list of games availabe, searchable with any text';
