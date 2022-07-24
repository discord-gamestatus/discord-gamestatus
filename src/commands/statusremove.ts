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

import { is } from "@douile/bot-utilities";

import Message from "../structs/Message";
import { isAdmin } from "../checks";
import { EMBED_COLOR } from "../constants";
import {
  CommandContext,
  CommandInteractionContext,
  MessageContext,
} from "../structs/CommandContext";

import { ApplicationCommandOptionData, Snowflake } from "discord.js-light";

const unknownError = Object.freeze({
  title: "Error",
  description:
    "You must provide a channel ID and message ID, or reply to a status\ne.g. `!statusremove #channel 788958200251299504`",
  color: 0xff0000,
});

export const name = "statusremove";
export const check = isAdmin;
export const help =
  "Remove a status message by replying to it, or by giving its channel ID and message ID\nRight click status, press reply to message, and use `!statusremove`\n`!statusmod #channel messageID`";
export const options: ApplicationCommandOptionData[] = [
  {
    name: "channel",
    description: "Channel ID",
    type: "CHANNEL",
    required: true,
  },
  {
    name: "message",
    description: "Message ID",
    type: "STRING",
    required: true,
  },
];

type MessageOrReference = Message | ReferencedMessage;
interface ReferencedMessage {
  id: Snowflake;
  channelId: Snowflake;
}

export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) return;

  let toDelete: MessageOrReference | null = null;
  if (guildContext instanceof MessageContext) {
    const message = guildContext.inner();
    // FIXME: In future versions this will be changed to MessageType
    if (message.type === "REPLY") {
      toDelete = {
        id: message.reference?.messageId as string,
        channelId: message.reference?.channelId as string,
      };
    }

    const parts = guildContext.options();
    if (parts.length > 1) {
      const channelId = is.discordChannel(parts[0]);
      if (channelId) toDelete = { id: parts[1], channelId };
    }
  } else if (guildContext instanceof CommandInteractionContext) {
    toDelete = {
      id: guildContext.inner().options.getString(options[1].name, true),
      channelId: guildContext.inner().options.getString(options[0].name, true),
    };
  } else {
    throw new Error("unreachable");
  }

  if (!toDelete) {
    await context.reply({ embeds: [unknownError], ephemeral: true });
    return;
  }

  const response = await context.reply({
    embeds: [{ title: "Removing status message", color: EMBED_COLOR }],
    ephemeral: true,
  });

  const success = await guildContext.updateCache().delete({
    guild: guildContext.guild().id,
    channel: toDelete.channelId,
    message: toDelete.id,
  });

  if (success > 0) {
    const channel = guildContext
      .guild()
      .channels.forge(toDelete.channelId, "GUILD_TEXT");
    const oldMessage = channel.messages.forge(toDelete.id);
    try {
      await oldMessage.delete();
    } catch (e) {
      // DO NOTHING
    }
    await response?.edit({
      embeds: [
        {
          title: "Done",
          description: "The status message has been removed",
          color: EMBED_COLOR,
        },
      ],
    });
  } else {
    await response?.edit({
      embeds: [
        {
          title: "Error",
          description: "Unable to remove the status message",
          color: 0xff0000,
        },
      ],
    });
  }
}
