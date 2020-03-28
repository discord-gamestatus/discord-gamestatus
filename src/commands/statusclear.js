const call = async function(message) {
  let current = message.client.updateCache.get(message.channel.id);

  if (current) {
    let message = await current.getMessage();
    if (message) {
      try {
        await message.delete();
      } catch(e) {
        // Do nothing
      }
    }
  }

  message.client.updateCache.delete(message.channel.id);
  await message.channel.send('Status updates have been cleared');
}

exports.name = 'statusclear';
exports.call = call;
