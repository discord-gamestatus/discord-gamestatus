/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2020 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const { isBotOwner } = require('../checks.js');
const { EMBED_COLOR } = require('../constants.js');

const call = async function(message) {
  let i = 0;
  let total = 0;
  const ticks = message.client.updateCache.tickIterable(message.client.config.tickCount);
  const tickList = Array.from(ticks).map(tick => {
    total += tick.length;
    return `${i++}: ${tick.length}`;
  }).join('\n');
  await message.channel.send({ embed: {
    title: `Ticks: ${message.client.config.tickCount}`,
    description: `Total updates: ${total}\nAverage updates per tick: ${Math.round(total/i * 1e3) / 1e3}\n\`\`\`\n${tickList}\`\`\``,
    color: EMBED_COLOR,
  }});
}

exports.name = 'tickdebug';
exports.call = call;
exports.check = isBotOwner;
exports.help = 'Debug status updates`';
