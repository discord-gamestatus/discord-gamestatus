const { RichEmbed } = require('discord.js');

const { isOfBaseType } = require('../util.js');

const matchAny = function(text, search) {
  for (let s of search) {
    if (text.match(s) !== null) return true;
  }
  return false;
}

const call = async function(message, parts) {
  const search = parts.map(s => new RegExp(s, 'gi'));
  if (search.length === 0) {
    await message.channel.send(new RichEmbed({
      title: 'Help',
      description: Array.from(message.client.commands.entries())
        .filter(cmd => cmd[0] !== 'help' && (isOfBaseType(cmd[1].check, Function) ? cmd[1].check(message) : true))
        .map(cmd => `\`${message.client.config.prefix}${cmd[0]}\``)
        .join('\n'),
      footer: { text: `Use "${message.client.config.prefix}help commandName" for detailed help` }
    }));
  } else {
    await message.channel.send(new RichEmbed({
      title: 'Help',
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
