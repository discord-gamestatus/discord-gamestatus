const { RichEmbed } = require('discord.js');

const OPTS = {
  dots: ['⚪','⚫'],
  title: function(server) {
    return `${server.name} server status`
  },
  color: 0x2894C2,
  columns: 3
}

const generateEmbed = function(server, tick, options) {
  let embed = new RichEmbed({
    title: options.title === undefined ? OPTS.title : options.title,
    color: options.color === undefined ? OPTS.color : options.color,
    timestamp: Date.now()
  });

  let dots = options.dots === undefined ? OPTS.dots : options.dots;
  embed.setFooter(dots[tick % dots.length]);

  let columns = options.columns === undefined ? OPTS.columns : options.columns,
  rows = Math.ceil(server.players.length / columns);

  for (let i=0;i<columns;i++) {
    let players = server.players.slice(i*rows, rows);
    embed.addField('_ _', players.join('\n'));
  }

  return embed;
}

module.exports = generateEmbed;
