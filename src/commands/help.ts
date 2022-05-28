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

import Message from "../structs/Message";
import { EMBED_COLOR } from "../constants";

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
export async function call(message: Message, parts: string[]): Promise<void> {
  const search = parts.map((s) => new RegExp(s, "gi"));
  if (search.length === 0) {
    await message.channel.send({
      embeds: [
        new MessageEmbed({
          title: "Help",
          color: EMBED_COLOR,
          description:
            "[More detailed documentation here](https://gamestatus.douile.com/docs/user)\n" +
            Array.from(message.client.commands.entries())
              .filter((cmd) =>
                cmd[0] !== "help" && cmd[1].check ? cmd[1].check(message) : true
              )
              .map((cmd) => `\`${message.client.config.prefix}${cmd[0]}\``)
              .join("\n"),
          footer: {
            text: `Use "${message.client.config.prefix}help commandName" for detailed help`,
          },
        }),
      ],
    });
  } else {
    await message.channel.send({
      embeds: [
        new MessageEmbed({
          title: "Help",
          color: EMBED_COLOR,
          description:
            "[More detailed documentation here](https://gamestatus.douile.com/docs/user)",
          fields: Array.from(message.client.commands.entries())
            .filter(
              (cmd) =>
                matchAny(`${message.client.config.prefix}${cmd[0]}`, search) &&
                (cmd[1].check ? cmd[1].check(message) : true)
            )
            .map((cmd) => {
              return {
                name: `${message.client.config.prefix}${cmd[0]}`,
                value:
                  typeof cmd[1].help === "string"
                    ? cmd[1].help
                    : "No help message provided",
                inline: false,
              };
            }),
        }),
      ],
    });
  }
}
