const GameDig = require('gamedig');
const GameResolver = require('gamedig/lib/GameResolver.js');

var resolver;

const getResolver = function() {
  if (!resolver) resolver = new GameResolver();
  return resolver;
}

const IMAGE = {
  fivem: function(state) {
    let info = state.raw.info ? state.raw.info : {};
    return info.icon ? { buffer: Buffer.from(info.icon, 'base64'), type: 'png' } : undefined;
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
    state.realPlayers = state.players.filter(v => typeof v.name === 'string');
  } catch(e) {
    state = {
      name: 'OFFLINE',
      map: 'OFFLINE',
      password: false,
      maxplayers: 0,
      players: null,
      realPlayers: null,
      offline: true,
      connect: ''
    };
  }

  state.gameHost = ip_parts[0];

  if (type in IMAGE) {
    state.image = await IMAGE[type].call(this, state);
  }

  if (state.offline) return state;

  return state;
}

const gameList = async function() {
  let resolver = getResolver();
  return resolver.games;
}

exports.query = query;
exports.gameList = gameList;
