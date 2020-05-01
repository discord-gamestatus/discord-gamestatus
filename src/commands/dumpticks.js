const { isBotOwner } = require('../checks.js');

const call = async function(message) {
  let output = '```';
  let i = 0;
  for (let tick of message.client.updateCache.tickIterable(30)) {
    output += `${i++}: ${tick.map(v => v.ip).join(', ')}\n`;
  }
  output += '```';
  await message.channel.send(output);
}

exports.name = 'dumpticks';
exports.call = call;
exports.check = isBotOwner;
