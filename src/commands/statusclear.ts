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

import { TextChannel } from "discord.js-light";

import { isAdmin } from "../checks";
import { CommandContext } from "../structs/CommandContext";
import { channelFirstArg } from "../utils";

export const name = "statusclear";
export const check = isAdmin;
export const help = "Clear all status messages from the channel";

export async function call(context: CommandContext): Promise<void> {
  const response = await context.reply({
    content: "Clearing status updates...",
    ephemeral: true,
  });
  let channel;
  try {
    channel = await channelFirstArg(message, args);
  } catch {
    return;
  }

  if (!channel || !(channel instanceof TextChannel)) return;

  const updates = await message.client.updateCache.get({
    channel: channel.id,
    guild: channel.guild.id,
  });
  for (const update of updates) {
    const msg = await update.getMessage(message.client);
    if (msg) {
      try {
        await msg.delete();
      } catch (e) {
        // DO NOTHING
      }
    }
  }

  const count = await message.client.updateCache.delete({
    guild: channel?.guild?.id,
    channel: channel?.id,
  });
  await response.edit(`${count} Status updates have been cleared`);
}
