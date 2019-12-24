const gamedig = require('gamedig');
const generateEmbed = require('../embed.js');

const call = async function(message, parts) {
  if (parts.length < 2) return;

  let state = await gamedig.query({
    type: parts[0],
    host: parts[1]
  });

  let embed = generateEmbed(state, 0);
  await message.channel.send(embed);
}

exports.name = 'test';
exports.call = call;
