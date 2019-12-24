const gamedig = require('gamedig');
const generateEmbed = require('../embed.js');

const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send('You must provide a game type and IP');

  let ip_parts = parts[1].split(':');

  let state = await gamedig.query({
    type: parts[0],
    host: ip_parts[0],
    port: ip_parts.length > 1 ? ip_parts[1] : undefined
  });

  let embed = generateEmbed(state, 0);
  await message.channel.send(embed);
}

exports.name = 'status';
exports.call = call;
