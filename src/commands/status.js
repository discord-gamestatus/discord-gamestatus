const query = require('../query.js')
const generateEmbed = require('../embed.js');

const call = async function(message, parts) {
  if (parts.length < 2) return await message.channel.send('You must provide a game type and IP');

  let state = await query(parts[0], parts[1]);

  let embed = generateEmbed(state, 0);
  await message.channel.send(embed);
}

exports.name = 'status';
exports.call = call;
