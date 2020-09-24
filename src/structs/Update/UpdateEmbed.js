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

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { FORMAT_PROPERTIES } = require('../../constants.js');

const serverFormat = function(string, server) {
  for (let prop of FORMAT_PROPERTIES) {
    string = string.replace(new RegExp(`\\{${prop}\\}`, 'gi'), server[prop]);
  }
  return string;
}

module.exports = {
  async generateEmbed(server, tick) {
    let players = server.realPlayers === null ? [] : server.realPlayers;

    let embed = new MessageEmbed({
      title: serverFormat(this.getOption('title'), server),
      description: serverFormat(this.getOption('description'), server),
      color: this.getOption('color'),
      timestamp: Date.now()
    });

    let dots = this.getOption('dots');
    embed.setFooter(dots[tick % dots.length]);

    let image = server.image;
    if (this.getOption('image').length > 0) image = {type: 'url', url: this.getOption('image')};

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
      if (column.length > 0) embed.addField('_ _', column.map(v => v.name).join('\n'), true);
    }

    return embed;
  },
  FORMAT_PROPERTIES
}
