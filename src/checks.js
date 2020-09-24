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

exports.isAdmin = function(message) {
  if (!message.member) return false;
  return message.member.hasPermission(message.client.config.adminFlag);
}

exports.isOwner = function(message) {
  if (!message.guild) return false;
  return message.guild.ownerID === message.author.id;
}

exports.isBotOwner = function(message) {
  return message.client.config.owner === message.author.id;
}
