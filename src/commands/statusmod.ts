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

import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionData,
  MessageEmbed,
} from "discord.js-light";

import Update from "../structs/Update";
import { isAdmin } from "../checks";
import { UpdateOptions } from "../structs/Update/UpdateOptions";
import { EMBED_COLOR, FORMAT_PROPERTIES } from "../constants";
import {
  CommandContext,
  GuildCommandContext,
  CommandInteractionContext,
  MessageContext,
} from "../structs/CommandContext";
import { warnLog } from "../debug";

const WARNING =
  "_Changes will not take effect until after the status has updated_";
const OPTION_LAYOUT: readonly (keyof UpdateOptions | "spacer")[] =
  Object.freeze([
    "title",
    "offlineTitle",
    "spacer",
    "description",
    "offlineDescription",
    "spacer",
    "color",
    "offlineColor",
    "spacer",
    "image",
    "offlineImage",
    "spacer",
    "connectUpdate",
    "disconnectUpdate",
    "spacer",
    "columns",
    "maxEdits",
    "dots",
  ]);

function statusIdentity(status: Update) {
  return `${status.name} [\`${status.ip}\`] <${status.messageLink()}>`;
}

export const name = "statusmod";
export const check = isAdmin;
export const help = `Modify status messages in the guild.\nUse cases:\n\
  - List statuses in current guild \`!statusmod\`\n\
  - Get status config \`!statusmod ID\` (e.g. \`!statusmod 0\`)\n\
  - Reset config option \`!statusmod ID option\` (e.g. \`!statusmod 0 title)\`\n\
  - Set config option \`statusmod ID option value\` (e.g. \`!statusmod 0 title Playing {map}\`)\n\
  Options will automatically be converted to the same type as seen when getting status options, this means for numbers you can do things like \`0xffe\` or \`2e3\`\n\
  When changing the title or description of an embed you can include formattable options that will be replaced with a value e.g. \`{validplayers}\` will be replaced with the number of players displayed in the embed\n\
  Full list of formattables: ${FORMAT_PROPERTIES.map((p) => `\`{${p}}\``).join(
    ", "
  )}`;
const OPTION_CHOICES: ApplicationCommandOptionChoiceData[] =
  OPTION_LAYOUT.filter((o) => o !== "spacer").map((o) => {
    return { name: o, value: o };
  });
const KEYS = {
  id: "status-id",
  key: "setting",
  value: "value",
};
export const options: ApplicationCommandOptionData[] = [
  {
    type: "SUB_COMMAND",
    name: "list",
    description: "List active statuses",
  },
  {
    type: "SUB_COMMAND",
    name: "get",
    description: "Get setting(s) values for a status",
    options: [
      {
        type: "INTEGER",
        name: KEYS.id,
        description: "ID of the status message",
        required: true,
        minValue: 0,
      },
    ],
  },
  {
    type: "SUB_COMMAND",
    name: "reset",
    description: "Reset a setting value",
    options: [
      {
        type: "INTEGER",
        name: KEYS.id,
        description: "ID of the status message",
        required: true,
        minValue: 0,
      },
      {
        type: "STRING",
        name: KEYS.key,
        description: "Setting to reset",
        required: true,
        choices: OPTION_CHOICES,
      },
    ],
  },
  {
    type: "SUB_COMMAND",
    name: "set",
    description: "Set the value of a setting",
    options: [
      {
        type: "INTEGER",
        name: KEYS.id,
        description: "ID of the status message",
        required: true,
        minValue: 0,
      },
      {
        type: "STRING",
        name: KEYS.key,
        description: "Setting to set",
        required: true,
        choices: OPTION_CHOICES,
      },
      {
        type: "STRING",
        name: KEYS.value,
        description: "New value of the setting",
        required: true,
      },
    ],
  },
];

type Options =
  | ListOptions
  | ViewOptions
  | ResetOptions
  | SetOptions
  | ErrorOptions;
interface ListOptions {
  mode: "list";
}
interface ViewOptions {
  mode: "view";
  index: number;
}
interface ResetOptions {
  mode: "reset";
  index: number;
  key: string;
}
interface SetOptions {
  mode: "set";
  index: number;
  key: string;
  value: string;
}
interface ErrorOptions {
  mode: "error";
  message: string;
}

function parseOptions(context: GuildCommandContext): Options {
  try {
    if (context instanceof MessageContext) {
      return parseOptionsFromMessage(context);
    }

    if (context instanceof CommandInteractionContext) {
      return parseOptionsFromCommandInteraction(context);
    }
  } catch (e) {
    warnLog(`Error parsing command "${name}"`, e);
    return {
      mode: "error",
      message: "Unexpected error parsing command options",
    };
  }

  throw new Error("unreachable");
}

function parseOptionsFromMessage(context: MessageContext): Options {
  const args = context.options();

  if (args.length === 0) return { mode: "list" };

  const index = parseInt(args[0].replace(/^#/, ""));
  if (isNaN(index))
    return { mode: "error", message: "Status index must be an integer" };
  if (args.length === 1) return { mode: "view", index };

  const key = args[1].trim();
  if (args.length === 2) return { mode: "reset", index, key };

  const value = args.slice(2).join(" ");
  return { mode: "set", index, key, value };
}

function parseOptionsFromCommandInteraction(
  context: CommandInteractionContext
): Options {
  const opts = context.inner().options;

  const command = opts.getSubcommand(true);

  // List
  if (command === options[0].name) return { mode: "list" };

  // Get
  const index = opts.getInteger(KEYS.id, true);
  if (command === options[1].name) {
    return { mode: "view", index };
  }

  // Reset
  const key = opts.getString(KEYS.key, true);
  if (command === options[2].name) {
    return { mode: "reset", index, key };
  }

  // Set
  const value = opts.getString(KEYS.value, true);
  if (command === options[3].name) {
    let parsed = value;
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      // Do nothing
    }
    if (typeof parsed !== "string") parsed = value;
    return { mode: "set", index, key, value: parsed };
  }

  throw new Error("unreachable");
}

export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) return;

  const options = parseOptions(guildContext);

  if (options.mode === "error") {
    await context.reply({
      content: `Error: ${options.message}`,
      ephemeral: true,
    });
    return;
  }

  let statuses = await context.client().updateCache.get({
    guild: guildContext.guild().id,
  });
  if (statuses === undefined) {
    statuses = [];
  } else if (!Array.isArray(statuses)) {
    statuses = [statuses];
  }

  if (options.mode === "list") {
    const fields = statuses.map((status: Update, i: number) => {
      return {
        name: `#${i}`,
        value: statusIdentity(status),
        inline: false,
      };
    });

    await context.reply({
      embeds: [
        new MessageEmbed({
          title: `${fields.length} Active statuses`,
          fields: fields,
          timestamp: Date.now(),
          color: EMBED_COLOR,
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  const status = statuses[options.index];
  if (options.mode === "view") {
    const opts = status.getOptions();
    const outputOptions = [];
    for (const fieldName of OPTION_LAYOUT) {
      if (fieldName === "spacer") {
        outputOptions.push({ name: "_ _", value: "_ _", inline: false });
      } else {
        outputOptions.push({
          name: fieldName,
          value: `\`\`\`json\n${JSON.stringify(opts[fieldName])}\n\`\`\``,
          inline: true,
        });
      }
    }

    await context.reply({
      embeds: [
        new MessageEmbed({
          title: `#${options.index}`,
          description: statusIdentity(status),
          fields: outputOptions,
          timestamp: Date.now(),
          color: EMBED_COLOR,
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  if (options.mode === "reset") {
    await status.deleteOption(
      context.client(),
      options.key as keyof UpdateOptions
    );
    await context.reply({
      embeds: [
        new MessageEmbed({
          title: `#${options.index}`,
          description: `${statusIdentity(status)}\nReset: \`${
            options.key
          }\`\n${WARNING}`,
          timestamp: Date.now(),
          color: EMBED_COLOR,
        }),
      ],
    });
    return;
  }

  if (options.mode === "set") {
    let error;
    try {
      await status.setOption(
        context.client(),
        options.key as keyof UpdateOptions,
        options.value
      );
    } catch (e) {
      error = e;
      console.error("Error setting option", error);
    }

    await context.reply({
      embeds: [
        new MessageEmbed({
          title: `#${options.index}`,
          description: `${statusIdentity(status)}\nSet: \`${
            options.key
          }=${status.getOption(
            options.key as keyof UpdateOptions
          )}\`\n${WARNING}`,
          timestamp: Date.now(),
          color: EMBED_COLOR,
        }),
      ],
    });
    return;
  }
}
