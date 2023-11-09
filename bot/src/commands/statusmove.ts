/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { isAdmin } from "../checks";
import {
  CommandContext,
  CommandInteractionContext,
  MessageContext,
} from "../structs/CommandContext";

import { ApplicationCommandOptionData, Snowflake } from "discord.js-light";

export const name = "statusmove";
export const check = isAdmin;
export const help = "Move a status to another channel";
export const options: ApplicationCommandOptionData[] = [
  {
    name: "from_id",
    description: "From channel",
    type: "CHANNEL",
    required: true,
  },
  {
    name: "message",
    description: "Message",
    type: "STRING",
    required: true,
  },
  {
    name: "to_id",
    description: "To channel",
    type: "CHANNEL",
    required: true,
  },
];

interface Options {
  channel: Snowflake;
  message: Snowflake;
  destinationChannel: Snowflake;
}

export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) return;

  let toMove: Options;
  if (guildContext instanceof MessageContext) {
    await guildContext.reply({ content: "todo" });
    return;
  } else if (guildContext instanceof CommandInteractionContext) {
    const opts = guildContext.inner().options;
    toMove = {
      channel: opts.getChannel(options[0].name, true).id,
      message: opts.getString(options[1].name, true),
      destinationChannel: opts.getChannel(options[2].name, true).id,
    };
  } else {
    throw new Error("unreachable");
  }

  // Defer here because database access can take some time.
  await guildContext.deferReply({
    content: "Moving status...",
    ephemeral: true,
  });

  const updates = await guildContext.updateCache().get({
    guild: guildContext.guild().id,
    channel: toMove.channel,
    message: toMove.message,
  });

  if (updates.length === 0) {
    await guildContext.editReply({
      content: "Could not find status",
    });
    return;
  }

  const updateToMove = updates[0];

  await Promise.all([
    (async () => {
      await updateToMove.setChannel(
        guildContext.client(),
        toMove.destinationChannel
      );
      await guildContext.updateCache().update(updateToMove);
    })(),
    guildContext
      .guild()
      .channels.forge(toMove.channel, "GUILD_TEXT")
      .messages.forge(toMove.message)
      .delete(),
  ]);

  await guildContext.editReply({
    content: `Status has been moved to <#${toMove.destinationChannel}>, it will appear next time it updates.`,
    ephemeral: true,
  });
}
