const { Guild } = require('discord.js');
const fetch = require('snekfetch');

exports.name = 'icon';
exports.call = async function(message, parts) {
  let guild = message.guild;
  if (parts.length > 0) {
    let res = await fetch.get(`https://discordapp.com/api/guilds/${parts[0]}`, {
      headers: { Authorization: `Bot ${message.client.token}`}
    });
    if (mGuild) guild = mGuild;
  }
  let url = guild.iconURL ? guild.iconURL : 'No icon';
  return await message.channel.send(`${guild.name} icon: <${url}>`);
}
