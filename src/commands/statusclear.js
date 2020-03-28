const Update = require('../structs/Update.js');
 
const call = async function(message, parts) {
 
  message.client.updateCache.delete(message.channel.id);
 
  // await message.delete();
}
 
exports.name = 'statusclear';
exports.call = call;
