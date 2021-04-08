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

const { MessageEmbed } = require('discord.js-light');

const { isAdmin } = require('../checks.js');
const { EMBED_COLOR } = require('../constants.js');

const WARNING = '_Changes will not take effect until after the status has updated_';
const OPTION_LAYOUT = Object.freeze([
  'title','offlineTitle','spacer',
  'description','offlineDescription','spacer',
  'color','offlineColor','spacer',
  'image','offlineImage','spacer',
  'connectUpdate','disconnectUpdate','spacer',
  'columns','maxEdits','dots'
]);

const statusIdentity = function(status) {
  return `${status.name} [\`${status.ip}\`] <${status.messageLink()}>`;
}

const call = async function(message) {
  const args = message.content.split(' ').splice(1);

  let statuses = await message.client.updateCache.get({ guild: message.guild.id });
  if (statuses === undefined) {
    statuses = [];
  } else if (!Array.isArray(statuses)) {
    statuses = [statuses];
  }

  if (args.length > 0) {
    const index = parseInt(args[0].replace(/^#/,''));
    if (!isNaN(index) && index < statuses.length && index >= 0) {
      let status = statuses[index];
      if (args.length === 1) {
        const opts = status.getOptions();
        let options = [];
        for (let fieldName of OPTION_LAYOUT) {
          if (fieldName === 'spacer') {
            options.push({name:'_ _',value:'_ _',inline:false});
          } else {
            options.push({name:fieldName,value:`\`\`\`json\n${JSON.stringify(opts[fieldName])}\n\`\`\``,inline:true});
          }
        }

        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: statusIdentity(status),
          fields: options,
          timestamp: Date.now(),
          color: EMBED_COLOR
        }));
      } else if (args.length === 2) {
        await status.deleteOption(message.client, args[1]);
        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: `${statusIdentity(status)}\nReset: \`${args[1]}\`\n${WARNING}`,
          timestamp: Date.now(),
          color: EMBED_COLOR
        }));
      } else {
        const value = args.splice(2).join(' ');
        let error;
        try {
          await status.setOption(message.client, args[1], value);
        } catch(e) {
          error = e;
          console.error('Error setting option', error);
        }

        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: `${statusIdentity(status)}\nSet: \`${args[1]}=${status.getOption(args[1])}\`\n${WARNING}`,
          timestamp: Date.now(),
          color: EMBED_COLOR
        }));
      }
    } else {
      if (statuses.length === 0) {
        await message.channel.send(`There are no status messages in this guild`);
      } else {
        await message.channel.send(`Please enter a valid status ID (between 0 and ${statuses.length-1})`);
      }

    }
  } else {
    const fields = statuses.map((status, i) => {
      return {
        name: `#${i}`,
        value: statusIdentity(status),
        inline: false
      }
    });
    await message.channel.send(new MessageEmbed({
      title: `${fields.length} Active statuses`,
      fields: fields,
      timestamp: Date.now(),
      color: EMBED_COLOR
    }));
  }
}


const { FORMAT_PROPERTIES } = require('../constants.js');
exports.name = 'statusmod';
exports.call = call;
exports.check = isAdmin;
exports.help = `Modify status messages in the guild.\nUse cases:\n\
  - List statuses in current guild \`!statusmod\`\n\
  - Get status config \`!statusmod ID\` (e.g. \`!statusmod 0\`)\n\
  - Reset config option \`!statusmod ID option\` (e.g. \`!statusmod 0 title)\`\n\
  - Set config option \`statusmod ID option value\` (e.g. \`!statusmod 0 title Playing {map}\`)\n\
  Options will automatically be converted to the same type as seen when getting status options, this means for numbers you can do things like \`0xffe\` or \`2e3\`\n\
  When changing the title or description of an embed you can include formattable options that will be replaced with a value e.g. \`{validplayers}\` will be replaced with the number of players displayed in the embed\n\
  Full list of formattables: ${FORMAT_PROPERTIES.map(p => `\`{${p}}\``).join(', ')}`;
