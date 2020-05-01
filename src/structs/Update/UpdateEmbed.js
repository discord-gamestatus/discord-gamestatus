const { RichEmbed, Attachment } = require('discord.js');

module.exports = {
  async generateEmbed(server, tick) {
    let players = server.realPlayers === null ? [] : server.realPlayers;

    let embed = new RichEmbed({
      title: this.getOption('title')(server),
      description: this.getOption('description')(server),
      color: this.getOption('color'),
      timestamp: Date.now()
    });

    let dots = this.getOption('dots');
    embed.setFooter(dots[tick % dots.length]);

    if (server.image) {
      let image = undefined;
      switch (server.image.type) {
        case 'buffer': {
          let name = `image.${server.image.dataType}`;
          embed.attachFile(new Attachment(server.image.buffer, name));
          image = `attachment://${name}`;
          break;
        }
        case 'url': {
          image = server.image.url;
          break;
        }
      }
      embed.setAuthor(embed.title, image);
      embed.setTitle('');
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
