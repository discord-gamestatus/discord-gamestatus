/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { MessageEmbed } from "discord.js-light";

// import * as Package from '../../package.json';
const Package = require("../../package.json");
import { humanDuration } from "@douile/bot-utilities";

import Message from "../structs/Message";
import { EMBED_COLOR } from "../constants";

export const name = "botinfo";
export const help = "Output runtime information";
export async function call(message: Message): Promise<void> {
  const client = message.client;

  const memoryUsage = process.memoryUsage();
  let supportLink = "";
  if (client.config.supportServer !== undefined) {
    supportLink = `[Join the support server](${client.config.supportServer})\n`;
  }

  const description = `[${Package.name} v${Package.version}](${
    Package.homepage
  }) [Report bugs here](${Package.bugs.url})\n${supportLink}\
Average ping: ${Math.round(client.ws.ping * 10) / 10}ms\n\
Uptime: ${humanDuration(client.uptime || 0, 1000)}\n\
Working in ${client.guilds.cache.size} guilds\n\
Memory usage: ${Math.round(memoryUsage.heapUsed / 1024)}kb/${Math.round(
    memoryUsage.heapTotal / 1024
  )}kb\n\
**Dependencies**\n\
[NodeJS ${process.version}](https://nodejs.org)\n\
[discord.js-light](https://github.com/timotejroiko/discord.js-light)\n\
[discord.js](https://github.com/discordjs/discord.js)\n\
[gamedig](https://github.com/gamedig/node-gamedig)`;

  await message.channel.send({
    embeds: [
      new MessageEmbed({
        title: `${Package.name} info`,
        description,
        timestamp: Date.now(),
        color: EMBED_COLOR,
      }),
    ],
  });
}
