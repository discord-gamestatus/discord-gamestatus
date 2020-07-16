const { MessageEmbed } = require('discord.js');

const { isAdmin } = require('../checks.js');

const WARNING = '_Changes will not take effect until after the status has updated_';

const statusIdentity = function(status) {
  return `${status.name} [\`${status.ip}\`] <${status.messageLink()}>`;
}

const call = async function(message) {
  const args = message.content.split(' ').splice(1);
  let statuses = message.client.updateCache.get(message.channel.id);
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
        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: `${statusIdentity(status)}\n\`\`\`json\n${JSON.stringify(status.getOptions(), ' ', 2)}\n\`\`\``,
          timestamp: Date.now()
        }));
      } else if (args.length === 2) {
        await status.deleteOption(message.client, args[1]);
        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: `${statusIdentity(status)}\nReset: \`${args[1]}\`\n${WARNING}`,
          timestamp: Date.now()
        }));
      } else {
        const value = args.splice(2).join(' ');
        await status.setOption(message.client, args[1], value);
        await message.channel.send(new MessageEmbed({
          title: `#${index}`,
          description: `${statusIdentity(status)}\nSet: \`${args[1]}=${status.getOption(args[1])}\`\n${WARNING}`,
          timestamp: Date.now()
        }));
      }
    } else {
      if (statuses.length === 0) {
        await message.channel.send(`There are no status messages in this channel`);
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
      timestamp: Date.now()
    }));
  }
}


const { FORMAT_PROPERTIES } = require('../constants.js');
exports.name = 'statusmod';
exports.call = call;
exports.check = isAdmin;
exports.help = `Modify status messages in the channel.\nUse cases:\n\
  - List statuses in current channel \`!statusmod\`\n\
  - Get status config \`!statusmod ID\`\n\
  - Reset config option \`!statusmod ID option\`\n\
  - Set config option \`statusmod ID option value\`\n\
  Options will automatically be converted to the same type as seen when getting status options, this means for numbers you can do things like \`0xffe\` or \`2e3\`\n\
  When changing the title or description of an embed you can include formattable options that will be replaced with a value e.g. \`{validplayers}\` will be replaced with the number of players displayed in the embed\n\
  Full list of formattables: ${FORMAT_PROPERTIES.map(p => `\`{${p}}\``).join(', ')}`;
