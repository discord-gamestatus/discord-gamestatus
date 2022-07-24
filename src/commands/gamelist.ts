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

import { gameList } from "../query";
import { isAdmin, isDMChannel, combineAny } from "../checks";
import { EMBED_COLOR } from "../constants";
import {
  CommandContext,
  CommandInteractionContext,
  MessageContext,
} from "../structs/CommandContext";
import { getSearch } from "../utils";

export const name = "gamelist";
export const check = combineAny(isAdmin, isDMChannel);
export const help =
  "Output the list of games available, searchable with any text";
export const options: ApplicationCommandOptionData[] = [
  {
    type: "STRING",
    name: "query",
    description: "Game to search for",
  },
];

export async function call(context: CommandContext): Promise<void> {
  const games = gameList();
  const gameIterator = games.values();
  let embed = new MessageEmbed({ color: EMBED_COLOR });
  let embedSize = 100;
  const embeds = [];
  let embedI = 0;

  embed.setFooter({ text: (++embedI).toString() });
  let field = "",
    key = gameIterator.next(),
    count = 0;
  const regex = getSearch(context, options[0].name);

  while (!key.done) {
    const game = key.value;
    let match = true;
    if (regex) {
      match = false;
      for (const r of regex) {
        for (const str of game.keys.concat(game.pretty)) {
          if (str.match(r) !== null) {
            match = true;
            break;
          }
        }
      }
    }
    if (match) {
      const value = `${game.pretty} = ${game.keys
        .map((v) => `\`${v}\``)
        .join(", ")}\n`;
      if (field.length + value.length > 1024) {
        if (embedSize + field.length + 3 > 6000) {
          embeds.push(embed);
          embed = new MessageEmbed({ color: EMBED_COLOR });
          embed.setFooter({ text: (++embedI).toString() });
          embedSize = 100;
        }
        embed.addField("_ _", field, false);
        embedSize += field.length + 3;
        field = "";
      }
      field += value;
      count += 1;
    }
    key = gameIterator.next();
  }
  if (field.length > 0) embed.addField("_ _", field);
  for (const e of embeds.concat(embed)) {
    e.setTitle(`${count} Available games`);
    await context.reply({ embeds: [e], ephemeral: true });
  }
}
