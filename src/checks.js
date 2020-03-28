exports.isAdmin = function (message) {
  if (!message.member) return false;
  return message.member.hasPermission('ADMINISTRATOR');
}
