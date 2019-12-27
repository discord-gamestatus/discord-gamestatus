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

async function query(type, ip) {
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
  } catch {
    state = {
      name: 'OFFLINE',
      map: 'OFFLINE',
      password: false,
      maxplayers: 0,
      players: [],
      offline: true,
      connect: ''
    };
  }

  if (state.offline) return state;
  if (type in IMAGE) {
    state.image = IMAGE[type](state);
  }

  return state;
}

module.exports = query;
