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

import GameDig from 'gamedig';
const GameResolver = 'gamedig/lib/GameResolver.js';

import { markdownEscape } from '@douile/bot-utilities';

import { verboseLog } from './debug';
import Client from './structs/Client';

interface Game {
  keys: string[],
  pretty: string,
  options: any,
  extra?: any,
  protocol: string,
}

interface GameResolver {
  lookup: (type: string) => Game,

  gamesByKey: Map<string, Game>,
  games: Game[],
}

let resolver: GameResolver;

function getResolver() {
  // @ts-ignore
  if (!resolver) resolver = new GameResolver();
  return resolver;
}

type ImageResolver = (this: Client, state: State) => Promise<Image | undefined>;
type ImageResolvers = {
  [name: string]: ImageResolver,
}

const IMAGE: ImageResolvers = {
  fivem: async function(this: Client, state: State): Promise<ImageBuffer | undefined> {
    const info = (state?.raw as { info?: { icon: string | undefined }}).info;
    return info?.icon ? { buffer: Buffer.from(info.icon, 'base64'), dataType: 'png', type: 'buffer' } || undefined : undefined;
  },
  discord: async function(this: Client, state: State): Promise<ImageUrl | undefined> {
    const guild = this.guilds.resolve(state.gameHost);
    if (!guild) return;
    const iconURL = guild.iconURL();
    return iconURL ? { url: iconURL, type: 'url' } : undefined;
  }
}

const parseConnect = function(connect: string, protocol: string) {
  switch(protocol) {
    case 'valve':
    return `<steam://connect/${connect}>`;
    case 'fivem':
    return `<fivem://connect/${connect}>`;
    default:
    return connect;
  }
}

const parseMap = function(map: string, protocol: string) {
  switch(protocol) {
    case 'minecraft':
    return 'Minecraft world';
    default:
    return map;
  }
}

export interface State extends GameDig.QueryResult {
  offline: boolean,
  numplayers: number,
  realPlayers: GameDig.Player[] | null,
  validPlayers: number,
  players: GameDig.Player[],
  gameHost: string,
  image?: Image,
}

export interface ImageUrl {
  type: 'url',
  url: string,
}

export interface ImageBuffer {
  type: 'buffer',
  dataType: string,
  buffer: Buffer,
}

export type Image = ImageUrl | ImageBuffer;

export async function query(this: Client, type: GameDig.Type, ip: string) {
  const ip_parts = ip.split(':');
  const protocol = getResolver().lookup(type).protocol;
  const isDiscord = protocol === 'discord';
  let state: State;

  try {
    const rawState = await GameDig.query({
      type: type,
      host: isDiscord ? 'localhost' : ip_parts[0],
      port: ip_parts.length > 1 ? parseInt(ip_parts[1]) : undefined,
      // realPlayers: [],
      // guildId: isDiscord ? ip_parts[0] : undefined,
    });
    let realPlayers = rawState.players.filter(v => typeof v.name === 'string')
      .map(v => {v.name = markdownEscape(v.name?.trim() || '');return v})
      .filter(v => v.name?.length || 0 > 0);
    state = {
      offline: false,
      numplayers: (rawState.raw as {[key: string]: number})['numplayers'] || rawState.players.length,
      realPlayers,
      validPlayers: realPlayers.length,
      gameHost: ip_parts[0],
      ...rawState
    };
    state.players = Array.from(state.players || []);
    state.connect = parseConnect(state.connect, protocol);
    state.map = parseMap(state.map, protocol);
  } catch(e) {
    verboseLog(e);
    state = {
      name: 'OFFLINE',
      map: 'OFFLINE',
      password: false,
      numplayers: 0,
      maxplayers: 0,
      validPlayers: 0,
      bots: [],
      ping: 0,
      players: [],
      realPlayers: null,
      offline: true,
      connect: ip,
      gameHost: ip_parts[0],
    };
  }

  if (type in IMAGE) {
    state.image = await IMAGE[type].call(this, state);
  }

  return state;
}

export async function gameList() {
  const resolver = getResolver();
  return resolver.games;
}

export function isValidGame(game: string) {
  const resolver = getResolver();
  return resolver.gamesByKey.has(game);
}
