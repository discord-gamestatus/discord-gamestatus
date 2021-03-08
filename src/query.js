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

const GameDig = require('gamedig');
const GameResolver = require('gamedig/lib/GameResolver.js');

const { verboseLog } = require('./debug.js');
const { markdownEscape } = require('@douile/bot-utilities');

var resolver;

const getResolver = function() {
  if (!resolver) resolver = new GameResolver();
  return resolver;
}

const IMAGE = {
  fivem: async function(state) {
    let info = state?.raw?.info;
    return info?.icon ? { buffer: Buffer.from(info.icon, 'base64'), dataType: 'png', type: 'buffer' } : undefined;
  },
  discord: async function(state) {
    let guild = this.guilds.get(state.gameHost);
    return guild ? { url: guild.iconURL, type: 'url' } : undefined;
  }
}

const parseConnect = function(connect, protocol) {
  switch(protocol) {
    case 'valve':
    return `<steam://connect/${connect}>`;
    case 'fivem':
    return `<fivem://connect/${connect}>`;
    default:
    return connect;
  }
}

const parseMap = function(map, protocol) {
  switch(protocol) {
    case 'minecraft':
    return 'Minecraft world';
    default:
    return map;
  }
}

const query = async function(type, ip) {
  let ip_parts = ip.split(':'), state;
  let protocol = getResolver().lookup(type).protocol;

  try {
    state = await GameDig.query({
      type: type,
      host: ip_parts[0],
      port: ip_parts.length > 1 ? ip_parts[1] : undefined,
      realPlayers: [],
    });
    state.players = Array.from(state.players);
    state.offline = false;
    state.connect = parseConnect(state.connect, protocol);
    state.numplayers = state.raw.numplayers || state.players.length;
    state.realPlayers = state.players.filter(v => typeof v.name === 'string');
    state.realPlayers.forEach(v => {v.name = markdownEscape(v.name.trim())});
    state.realPlayers = state.realPlayers.filter(v => v.name.length > 0);
    state.validPlayers = state.realPlayers.length;
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
      players: null,
      realPlayers: null,
      offline: true,
      connect: ip
    };
  }

  state.gameHost = ip_parts[0];

  if (type in IMAGE) {
    state.image = await IMAGE[type].call(this, state);
  }

  return state;
}

const gameList = async function() {
  const resolver = getResolver();
  return resolver.games;
}

const isValidGame = function(game) {
  const resolver = getResolver();
  return resolver.gamesByKey.has(game);
}

exports.query = query;
exports.gameList = gameList;
exports.isValidGame = isValidGame;
