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

import { ApplicationCommandOptionData, MessageEmbed } from "discord.js-light";

import { EMBED_COLOR } from "../constants";
import { CommandContext } from "../structs/CommandContext";

function matchAny(text: string, search: RegExp[]): boolean {
  for (const s of search) {
    if (text.match(s) !== null) {
      return true;
    }
  }
  return false;
}

export const name = "help";
export const help = "Get help with how to use commands";
export const options: ApplicationCommandOptionData[] = [
  {
    type: "STRING",
    name: "command",
    description: "Command to retrieve help for",
  },
];
export async function call(context: CommandContext): Promise<void> {
  const search = context.options().map((s) => new RegExp(s as string, "gi"));
  if (search.length === 0) {
    await context.reply({
      embeds: [
        new MessageEmbed({
          title: "Help",
          color: EMBED_COLOR,
          description:
            "[More detailed documentation here](https://gamestatus.douile.com/docs/user)\n" +
            Array.from(context.client().commands.entries())
              .filter((cmd) =>
                cmd[0] !== "help" && cmd[1].check ? cmd[1].check(context) : true
              )
              .map((cmd) => `\`${context.client().config.prefix}${cmd[0]}\``)
              .join("\n"),
          footer: {
            text: `Use "${
              context.client().config.prefix
            }help commandName" for detailed help`,
          },
        }),
      ],
      ephemeral: true,
    });
  } else {
    await context.reply({
      embeds: [
        new MessageEmbed({
          title: "Help",
          color: EMBED_COLOR,
          description:
            "[More detailed documentation here](https://gamestatus.douile.com/docs/user)",
          fields: Array.from(context.client().commands.entries())
            .filter(
              (cmd) =>
                matchAny(
                  `${context.client().config.prefix}${cmd[0]}`,
                  search
                ) && (cmd[1].check ? cmd[1].check(context) : true)
            )
            .map((cmd) => {
              return {
                name: `${context.client().config.prefix}${cmd[0]}`,
                value:
                  typeof cmd[1].help === "string"
                    ? cmd[1].help
                    : "No help message provided",
                inline: false,
              };
            }),
        }),
      ],
      ephemeral: true,
    });
  }
}
