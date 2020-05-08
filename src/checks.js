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
