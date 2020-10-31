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

const { getLimits } = require('../limits.js');
const { EMBED_COLOR } = require('../constants.js');

const call = async function(message) {
  let user;
  if (message.channel.type === 'dm') {
    user = message.author;
  } else {
    user = await message.client.users.fetch(message.guild.ownerID);
  }
  const limits = await getLimits(message.client, user.id);
  await message.channel.send(new MessageEmbed({
    author: {
      name: user.username,
      iconURL: user.displayAvatarURL()
    },
    fields: Object.entries(limits).map(e => {return {name:e[0],value:e[1],inline:true}}),
    color: EMBED_COLOR,
  }));
}


// TODO: Add command showing guild/channel status limit

exports.name = 'limits';
exports.call = call;
exports.help = 'View your guild/channel limits';
