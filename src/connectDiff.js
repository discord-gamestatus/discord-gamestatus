function connectDiff(curPlayers, prevPlayers) {
  if (!(prevPlayers instanceof Array) || !(curPlayers instanceof Array)) return { connect: [], disconnect: [], all: [] };
  let result = { connect: [], disconnect: [] };
  for(let player of curPlayers) {
    if (!prevPlayers.includes(player)) result.connect.push({name: player, connect: true, msg: `**${player}** connected`});
  }
  for (let player of prevPlayers) {
    if (!curPlayers.includes(player)) result.disconnect.push({name: player, connect: false, msg: `**${player}** disconnected`}); // TODO: Strip formatting chars from player names
  }
  result.all = result.connect.concat(result.disconnect);
  return result;
}

module.exports = connectDiff;
