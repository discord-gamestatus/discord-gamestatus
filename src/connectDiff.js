function connectDiff(curPlayers, prevPlayers) {
  if (!(prevPlayers instanceof Array) || !(curPlayers instanceof Array)) return [];
  let result = [];
  for (let player of prevPlayers) {
    if (!curPlayers.includes(player)) result.push(`${player} disconnected...`);
  }
  for(let player of curPlayers) {
    if (!prevPlayers.includes(player)) result.push(`${player} connected...`);
  }
  return result;
}

module.exports = connectDiff;
