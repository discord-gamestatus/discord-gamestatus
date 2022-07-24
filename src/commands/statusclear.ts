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

import { GuildChannel } from "discord.js";

import { isAdmin } from "../checks";
import {
  CommandContext,
  CommandInteractionContext,
  MessageContext,
} from "../structs/CommandContext";
import { channelFirstArg } from "../utils";

export const name = "statusclear";
export const check = isAdmin;
export const help = "Clear all status messages from the channel";

export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) return;

  let channel;
  if (guildContext instanceof MessageContext) {
    channel = await channelFirstArg(
      guildContext.inner(),
      guildContext.options()
    );
  } else if (guildContext instanceof CommandInteractionContext) {
    channel = guildContext.channel();
  } else {
    throw new Error("unreachable");
  }

  if (!channel || channel.type === "DM") {
    return;
  }

  const response = await context.reply({
    content: "Clearing status updates...",
    ephemeral: true,
  });

  const updates = await context.updateCache().get({
    channel: channel.id,
    guild: channel.guild.id,
  });
  for (const update of updates) {
    const msg = await update.getMessage(context.client());
    if (msg) {
      try {
        await msg.delete();
      } catch (e) {
        // DO NOTHING
      }
    }
  }

  const count = await context.updateCache().delete({
    guild: channel.guild.id,
    channel: channel.id,
  });
  // FIXME: We should check when we can't edit the response
  await response?.edit(`${count} Status updates have been cleared`);
}
