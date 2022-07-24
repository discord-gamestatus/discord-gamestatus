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

import { getLimits, getUserLimits } from "../limits";
import { EMBED_COLOR } from "../constants";
import { CommandContext } from "../structs/CommandContext";

export const name = "limits";
export const help = "View your guild/channel limits";

export async function call(context: CommandContext): Promise<void> {
  const guild = context.guild();
  const limits = guild
    ? await getLimits(context.client(), guild, true)
    : await getUserLimits(context.client(), context.user().id, true);
  const user = await context.client().users.fetch(limits.user);
  await context.reply({
    embeds: [
      new MessageEmbed({
        author: {
          name: user.username,
          iconURL: user.displayAvatarURL(),
        },
        fields: Object.entries(limits.limits).map(([name, value]) => {
          return { name, value: String(value), inline: true };
        }),
        color: EMBED_COLOR,
      }),
    ],
    ephemeral: true,
  });
}
