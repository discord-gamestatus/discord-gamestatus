const GameDig = require('gamedig');
const GameResolver = require('gamedig/lib/GameResolver.js');

const { verbooseLog } = require('./debug.js');
const { markdownEscape } = require('./util.js');

var resolver;

const getResolver = function() {
  if (!resolver) resolver = new GameResolver();
  return resolver;
}

const IMAGE = {
  fivem: async function(state) {
    let info = state.raw.info ? state.raw.info : {};
    return info.icon ? { buffer: Buffer.from(info.icon, 'base64'), dataType: 'png', type: 'buffer' } : undefined;
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
      port: ip_parts.length > 1 ? ip_parts[1] : undefined
    });
    state.offline = false;
    state.connect = parseConnect(state.connect, protocol);
    state.numplayers = state.raw.numplayers || state.players.length;
    state.realPlayers = state.players.filter(v => typeof v.name === 'string');
    state.realPlayers.forEach(v => {v.name = markdownEscape(v.name.trim())});
    state.realPlayers = state.realPlayers.filter(v => v.name.length > 0);
    state.map = parseMap(state.map, protocol);
  } catch(e) {
    verbooseLog(e);
    state = {
      name: 'OFFLINE',
      map: 'OFFLINE',
      password: false,
      numplayers: 0,
      maxplayers: 0,
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
