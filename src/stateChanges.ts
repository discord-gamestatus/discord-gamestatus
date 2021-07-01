/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2021 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/


export interface PlayerChange {
  name: string,
  connect: boolean,
  msg: string,
}
export interface PlayerChanges {
  connect: PlayerChange[],
  disconnect: PlayerChange[],
  all: PlayerChange[],
}

function playerChanges(curPlayers?: string[], prevPlayers?: string[]): PlayerChanges {
  if (!(prevPlayers instanceof Array) || !(curPlayers instanceof Array)) return { connect: [], disconnect: [], all: [] };

  let result: any = { connect: [], disconnect: [] };
  for (let player of curPlayers) {
    if (!prevPlayers.includes(player)) result.connect.push({name: player, connect: true, msg: `**${player}** connected`});
  }
  for (let player of prevPlayers) {
    if (!curPlayers.includes(player)) result.disconnect.push({name: player, connect: false, msg: `**${player}** disconnected`});
  }
  result.all = result.connect.concat(result.disconnect);
  return result;
}


export interface Change {
  old: any,
  new: any,
}

export interface Changes {
  players: PlayerChanges,
  props: {
    [key: string]: Change,
  },
}

const KEYS = [ 'offline', 'map' ];
export default function stateChanges(curState: any, prevState: any): Changes {
  let res: Changes = { players: playerChanges(curState.players, prevState.players), props: {} };
  for (let key of KEYS) {
    if (curState[key] !== prevState[key]) {
      res.props[key] = { old: prevState[key], new: curState[key] };
    }
  }
  return res;
}
