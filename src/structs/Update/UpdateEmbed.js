const { RichEmbed, Attachment } = require('discord.js');

const FORMAT_PROPERTIES = [ 'name', 'map', 'numplayers', 'maxplayers', 'connect' ];
const serverFormat = function(string, server) {
  for (let prop of FORMAT_PROPERTIES) {
    string = string.replace(new RegExp(`\\{${prop}\\}`, 'gi'), server[prop]);
  }
  return string;
}

module.exports = {
  async generateEmbed(server, tick) {
    let players = server.realPlayers === null ? [] : server.realPlayers;

    let embed = new RichEmbed({
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
          let name = `image.${image.dataType}`;
          embed.attachFile(new Attachment(image.buffer, name));
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
  }
}
