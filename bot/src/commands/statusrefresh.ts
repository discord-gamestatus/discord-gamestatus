/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2021-2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { TextChannel } from "discord.js-light";

import { isAdmin } from "../checks";
import { EMBED_COLOR } from "../constants";
import { channelFirstArg } from "../utils";
import { CommandContext, MessageContext } from "../structs/CommandContext";

export const name = "statusrefresh";
export const help = "Force bot to resend all status messages (next update).";
export const check = isAdmin;

export async function call(context: CommandContext): Promise<void> {
  let channel;
  if (context instanceof MessageContext) {
    const args = context.options();

    try {
      channel = await channelFirstArg(context.inner(), args);
    } catch {
      return;
    }
  } else {
    channel = context.channel();
  }

  if (!channel || !(channel instanceof TextChannel)) return;

  // Defer here because database access can take some time.
  await context.deferReply({ content: "Loading...", ephemeral: true });

  let statuses = await context.updateCache().get({
    channel: channel.id,
    guild: channel.guild.id,
  });
  if (statuses === undefined) {
    statuses = [];
  } else if (!Array.isArray(statuses)) {
    statuses = [statuses];
  }

  if (statuses.length === 0) {
    await context.editReply({
      embeds: [
        {
          title: "Error",
          description: `No statuses in the channel <#${channel.id}>`,
          color: 0xff0000,
        },
      ],
      ephemeral: true,
    });
    return;
  }

  await context.editReply({
    embeds: [
      {
        title: "Working...",
        description: `Refreshing ${statuses.length} updates`,
        color: EMBED_COLOR,
      },
    ],
    ephemeral: true,
  });

  for (const status of statuses) {
    await status.deleteMessage(context.client());
    await status.setMessage(context.client(), undefined); // Clear message
  }

  const replyOptions = {
    embeds: [
      {
        title: "Done",
        description: `Refreshed ${statuses.length} updates`,
        color: EMBED_COLOR,
      },
    ],
  };
  await context.editReply(replyOptions);
}
