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
const { MessageEmbed, User } = require('discord.js');

const stateChanges = require('../../stateChanges.js');
const { query } = require('../../query.js');
const { debugLog, verbooseLog } = require('../../debug.js');
const { allSettled } = require('@douile/bot-utilities');

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
      console.warn('Error sending update', e, e.stack);
    }
    try {
      await this.sendPlayerNotifications(client, state, changes.players);
    } catch(e) {
      console.warn('Error sending player notifications', e);
    }
    try {
      await this.sendServerNotifications(client, state, changes);
    } catch(e) {
      console.warn('Error sending server notifications', e);
    }

    let _end = performance.now();
    verbooseLog(`Update completed in ${_end-_start}ms`);
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
      // Unknown message after 184 edits
      if ((message.edits.length >= this.getOption('maxEdits') || !message.editable) && !message.deleted) { // If mesasge isn't deleted and has expired try to delete it
        await this.deleteMessage(client, message);
      } else if (!message.deleted) { // If message isn't deleted it try to edit it
        let success = true;
        try {
          await message.edit.apply(message, args);
        } catch(e) {
          success = false;
          await this.deleteMessage(client, message);
        }
        if (success) return; // If sucessfully edited exit function
      }
      verbooseLog(`Sending new message, ${message.id} should be deleted`);
    }

    // Send a new message
    let channel = await this.getChannel(client);
    if (channel) {
      let newMessage;
      try {
        newMessage = await channel.send.apply(channel, args);
      } catch(e) {
        debugLog('Unable to send new update', e);
      }
      await this.setMessage(client, newMessage);
    }
  },

  async sendPlayerNotifications(client, state, diff) {
    let fields = {};
    for (let player of diff.all) {
      if (player.name in this.notifications) {
        let field = `${player.msg} ${player.connect ? 'to' : 'from'} ${state.name} (${state.connect})`;
        for (let user in this.notifications[player.name]) {
          if (user in fields) {
            fields[user].push(field);
          } else {
            fields[user] = [field];
          }
        }
      }
    }
    let promises = [];
    for (let user in fields) {
      let embed = new MessageEmbed({
        title: 'Player update notification',
        description: fields[user].join('\n'),
        timestamp: Date.now()
      });
      let u = client.users.get(user);
      if (u instanceof User) promises.push(u.send(embed));
      else console.warn(user, 'Is not a valid user snowflake');
    }
    return await allSettled(promises);
  },

  async sendServerNotifications(client, state, changes) {
    if (!changes.offline && !changes.map) return;
    let embed = new MessageEmbed({
      title: 'Server update notification',
      timestamp: Date.now()
    });
    if (changes.offline) {
      embed.setDescription(`${this.name} is now ${changes.offline.new ? 'Offline' : 'Online'}`);
    } else {
      embed.setDescription(this.name);
    }
    if (changes.map) {
      embed.addField('Changed map', `From **${changes.map.old}** to **${changes.map.new}**`);
    }
    let promises = [];
    for (let user in this.notifyServer) {
      const u = client.users.fetch(user);
      if (u instanceof User) promises.push(u.send(embed));
      else console.warn(user, 'Is not a valid user snowflake');
    }
    return await allSettled(promises);
  },

  async deleteMessage(client, message) {
    if (!message) message = await this.getMessage(client);
    try {
      await message.delete();
    } catch(e) {
      let code = e;
      if ('code' in e) code = e.code;
      verbooseLog(`Unable to delete message ${message.id}`, code);
    }
    return message;
  }
};
