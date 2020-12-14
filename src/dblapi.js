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

const fetch = require('node-fetch');

const { debugLog, verboseLog } = require('./debug.js');

const URL_API = 'https://top.gg/api';
const DBL_TIMEOUT = 1000;

const sendDBLUpdateRequest = async function(client, key) {
  const servers = client.guilds.cache.size;
  const res = await fetch(`${URL_API}/bots/${client.user.id}/stats`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      server_count: servers,
      shard_id: client.shard ? client.shard.id : 0,
      shard_count: client.shard ? client.shard.count : 1
    })
  });
  if (res.status === 429) {
    const data = await res.json();
    client._DBL_INFO.lastUpdate = Date.now() + data['retry-after'];
    if (isNaN(client._DBL_INFO.lastUpdate)) client._DBL_INFO.lastUpdate = Date.now() + 0x36ee80;
    return sendDBLUpdate(client, key)();
  } else if (!res.ok) {
    throw new Error(`DBL api returned error code ${res.status} ${res.statusText}`);
  }
  verboseLog(`Successfully update DBL (server count: ${servers})`);
}

const sendDBLUpdate = function(client, key) {
  const CLIENT = client;
  const KEY = key;
  return function() {
    const now = Date.now();
    const next = CLIENT._DBL_INFO.lastUpdate + DBL_TIMEOUT;
    if (next <= now) {
      sendDBLUpdateRequest(CLIENT, KEY).then(null).catch(debugLog);
    } else if (CLIENT._DBL_INFO.currentTimeout === null) {
      CLIENT._DBL_INFO.currentTimeout = setTimeout(function() {
        CLIENT._DBL_INFO.currentTimeout = null;
        sendDBLUpdate(client, key)();
      }, next-now);
    }
  }
}

const startDBLApiHook = function(client, key) {
  Object.defineProperty(client, '_DBL_INFO', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: {
      lastUpdate: 0,
      currentTimeout: null
    }
  });

  const sendUpdate = sendDBLUpdate(client, key);

  client.once('ready', sendUpdate);
  client.on('guildCreate', sendUpdate);
  client.on('guildDelete', sendUpdate);

  debugLog('Successfully setup DBL API hook');
}

module.exports = startDBLApiHook;
