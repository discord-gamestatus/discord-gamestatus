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

import { Player } from "gamedig";

import { State } from "./query";

export interface PlayerChange {
  name?: string,
  connect: boolean,
  msg: string,
}
export interface PlayerChanges {
  connect: PlayerChange[],
  disconnect: PlayerChange[],
  all: PlayerChange[],
}

function playerChanges(curPlayers?: Player[], prevPlayers?: Player[]): PlayerChanges {
  if (!(prevPlayers instanceof Array) || !(curPlayers instanceof Array)) return { connect: [], disconnect: [], all: [] };

  const connect: PlayerChange[] = [];
  const disconnect: PlayerChange[] = [];
  for (const player of curPlayers) {
    if (!prevPlayers.includes(player)) connect.push({ name: player.name, connect: true, msg: `**${player}** connected` });
  }
  for (const player of prevPlayers) {
    if (!curPlayers.includes(player)) disconnect.push({ name: player.name, connect: false, msg: `**${player}** disconnected` });
  }
  return {
    connect,
    disconnect,
    all: connect.concat(disconnect),
  };
}

export interface Change<T extends keyof State> {
  old: State[T],
  new: State[T],
}

export interface Changes {
  players: PlayerChanges,
  props: {
    [key in "offline" | "map"]?: Change<key>;
  },
}

const KEYS: (keyof Changes["props"])[] = ['offline', 'map'];
export default function stateChanges(curState: State, prevState: State): Changes {
  const res: Changes = { players: playerChanges(curState.players, prevState.players), props: {} };
  for (const key of KEYS) {
    if (curState[key] !== prevState[key]) {
      //res.props[key] = { old: prevState[key], new: curState[key] };
      res.props = {
        ...res.props,
        [key]: { old: prevState[key], new: curState[key] },
      }
    }
  }
  return res;
}
