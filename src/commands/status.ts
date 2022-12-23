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

import { ApplicationCommandOptionData, TextChannel } from "discord.js-light";

import Update from "../structs/Update";
import { isAdmin } from "../checks";
import { isValidGame } from "../query";
import { verboseLog } from "../debug";
import {
  CommandContext,
  CommandInteractionContext,
  GuildCommandContext,
  MessageContext,
} from "../structs/CommandContext";

export const name = "status";
export const check = isAdmin;
export const help =
  "Create a status message, you must provide game and IP\ne.g. `!status csgo 192.168.0.1`";
export const options: ApplicationCommandOptionData[] = [
  {
    type: "STRING",
    name: "game",
    description: "Game type for query",
    //    choices: gameList().map(g => { return { name: g.keys[0], value: g.keys[0] }}),
    required: true,
  },
  {
    type: "STRING",
    name: "ip",
    description: "Server IP (and port)",
    required: true,
  },
];

interface StatusOptions {
  type: "options";
  game: string;
  host: string;
}

interface StatusOptionsError {
  type: "error";
  error: string;
}

function getParameters(
  context: GuildCommandContext
): StatusOptions | StatusOptionsError {
  if (context instanceof MessageContext) {
    const parts = context.options().filter((s) => s.length > 0);
    if (parts.length < 2) {
      return {
        type: "error",
        error: `You must provide a game type (view and search the gamelist with \`${
          context.client().config.prefix
        }gamelist\`) and IP instead of \`${parts.join(" ")}\``,
      };
    }
    return {
      type: "options",
      game: parts[0],
      host: parts[1],
    };
  }
  if (context instanceof CommandInteractionContext) {
    const opts = context.inner().options;
    return {
      type: "options",
      game: opts.getString(options[0].name, true),
      host: opts.getString(options[1].name, true),
    };
  }
  throw new Error("unreachable");
}

export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) return;

  const parameters = getParameters(guildContext);
  if (parameters.type === "error") {
    await context.reply({
      content: parameters.error,
      ephemeral: true,
    });
    return;
  }

  if (!isValidGame(parameters.game)) {
    await context.reply({
      content: `\`${parameters.game}\` is not a valid game please check \`${
        context.client().config.prefix
      }gamelist\``,
      ephemeral: true,
    });
    return;
  }

  // Check channel permissions
  const channel = context.channel();
  if (!channel) throw new Error("No channel");
  const updateCache = context.updateCache();

  const update = new Update(
    {
      type: parameters.game,
      ip: parameters.host,
    },
    { channel: channel as TextChannel }
  );

  // Check if this is a valid status message to add
  const error = await updateCache.canAddUpdate(update, context.client());
  if (error !== undefined) {
    await channel.send(error);
    return;
  }

  update._dontAutoSave = true;
  const state = await update.send(context.client(), 0);
  if (state?.offline === true) {
    const updateMessage = await update.getMessage(context.client());
    if (updateMessage) await updateMessage.delete();
    // No need to delete as update isn't in database yet
    await context.reply({
      content: `The server (\`${parameters.host}\`) was offline or unreachable`,
    });
    return;
  }
  await updateCache.create(update);
  update._dontAutoSave = false;
  await context.reply({
    content: "Status created",
    ephemeral: true,
  });
  verboseLog(`[C/status] Created update ${update.ID()}`);
}
