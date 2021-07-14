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

import { MessageEmbed } from "discord.js-light";

import Message from "../structs/Message";
import { getLimits } from "../limits";
import { EMBED_COLOR } from "../constants";

export const name = "limits";
export const help = "View your guild/channel limits";

export async function call(message: Message): Promise<void> {
  let user;
  if (message.channel.type === "dm" || !message.guild) {
    user = message.author;
  } else {
    const guild = await message.client.guilds.fetch(message.guild);
    user = await message.client.users.fetch(guild.ownerID);
  }
  const limits = await getLimits(message.client, user.id, true);
  await message.channel.send(
    new MessageEmbed({
      author: {
        name: user.username,
        iconURL: user.displayAvatarURL()
      },
      fields: limits
        ? Object.entries(limits).map(e => {
          return { name: e[0], value: e[1], inline: true };
        })
        : [],
      color: EMBED_COLOR
    })
  );
}
