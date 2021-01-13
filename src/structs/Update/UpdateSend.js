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

const { performance } = require('perf_hooks');

const stateChanges = require('../../stateChanges.js');
const { query } = require('../../query.js');
const { debugLog, warnLog, verboseLog } = require('../../debug.js');

module.exports = {
  async send(client, tick) {
    let _start = performance.now();

    if (!tick) tick = 0;

    let prevState = this.state;
    const boundQuery = query.bind(client);
    let state = await boundQuery(this.type, this.ip);
    this.state = {
      players: state.realPlayers ? state.realPlayers.map(v => v.name) : null,
      offline: state.offline,
      map: state.map
    };
    if (!state.offline) this.name = state.name;

    let changes = stateChanges(this.state, prevState);

    try {
      await this.sendUpdate(client, tick, state, changes);
    } catch(e) {
      warnLog('Error sending update', e, e.stack);
    }

    let _end = performance.now();
    verboseLog(`Update completed in ${_end-_start}ms`);
    return state;
  },

  async sendUpdate(client, tick, state, changes) {
    const embed = await this.generateEmbed(state, tick);

    let changesToSend = [];
    if (this.getOption('connectUpdate')) changesToSend = changesToSend.concat(changes.players.connect);
    if (this.getOption('disconnectUpdate')) changesToSend = changesToSend.concat(changes.players.disconnect);

    let args = [changesToSend.length > 0 ? changesToSend.map(v => v.msg).join('\n').substring(0,500) : '', embed];

    let message = await this.getMessage(client);
    if (message) {
      try {
        await message.edit.apply(message, args);
      } catch(e) {
        verboseLog(`Error editing message ${message.id}`, message);
      }
    } else {
      let channel = await this.getChannel(client);
      if (channel) {
        let newMessage;
        try {
          newMessage = await channel.send.apply(channel, args);
        } catch(e) {
          if (e.code === 50013) {
            this._shouldDelete = true;
          } else {
            debugLog('Unable to send new update', e);
          }
        }
        await this.setMessage(client, newMessage);
      }
    }
  },

  async deleteMessage(client, message) {
    if (!message) message = await this.getMessage(client);
    if (!message) return;
    try {
      await message.delete();
    } catch(e) {
      let code = e;
      if ('code' in e) code = e.code;
      verboseLog(`Unable to delete message ${message.id}`, code);
    }
    return message;
  }
};
