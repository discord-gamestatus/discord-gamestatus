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

const { MessageEmbed, MessageAttachment } = require('discord.js-light');
const { truncateEmbed } = require('@douile/bot-utilities');

const { FORMAT_PROPERTIES } = require('../../constants.js');

const serverFormat = function(string, server) {
  for (let prop of FORMAT_PROPERTIES) {
    string = string.replace(new RegExp(`\\{${prop}\\}`, 'gi'), server[prop]);
  }
  return string;
}

const OPT_TITLE = Object.freeze(['title', 'offlineTitle']);
const OPT_DESCRIPTION = Object.freeze(['description', 'offlineDescription']);
const OPT_COLOR = Object.freeze(['color', 'offlineColor']);
const OPT_IMAGE = Object.freeze(['image', 'offlineImage']);

module.exports = {
  async generateEmbed(server, tick) {
    let players = server.realPlayers === null ? [] : server.realPlayers;

    const isOffline = server.offline & 1;

    let embed = new MessageEmbed({
      title: serverFormat(this.getOption(OPT_TITLE[isOffline]), server),
      description: serverFormat(this.getOption(OPT_DESCRIPTION[isOffline]), server),
      color: this.getOption(OPT_COLOR[isOffline]),
      timestamp: Date.now()
    });

    let dots = this.getOption('dots');
    embed.setFooter(dots[tick % dots.length]);

    let image = server.image;
    const selectedImage = this.getOption(OPT_IMAGE[isOffline]);
    if (selectedImage.length > 0) image = {type: 'url', url: selectedImage};

    if (image) {
      let embedImage = undefined;
      switch (image.type) {
        case 'buffer': {
          const name = `image.${image.dataType}`;
          embed.attachFiles([new MessageAttachment(image.buffer, name)]);
          embedImage = `attachment://${name}`;
          break;
        }
        case 'url': {
          embedImage = image.url;
          break;
        }
      }
      embed.setThumbnail(embedImage);
      /*
      embed.setAuthor(embed.title, embedImage);
      embed.setTitle('');
      */
    }


    let columns = this.getOption('columns'),
    rows = Math.ceil(players.length / columns);

    for (let i=0;i<columns;i++) {
      let column = players.splice(0, rows);
      if (column.length > 0) {
        const columnText = column.map(v => v.name).join('\n');
        embed.addField('_ _', columnText, true);
      }
    }

    return truncateEmbed(embed);
  },
  FORMAT_PROPERTIES
}
