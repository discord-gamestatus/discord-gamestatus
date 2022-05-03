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

import { MessageEmbed } from "discord.js-light";
import { truncateEmbed } from "@douile/bot-utilities";
import { Player } from "gamedig";

import Update from "../Update";
import { UpdateOptions } from "./UpdateOptions";
import { FORMAT_PROPERTIES } from "../../constants";
import { State } from "../../query";

function serverFormat(str: string, server: State) {
  for (const prop of <[keyof State]>FORMAT_PROPERTIES) {
    str = str.replace(
      new RegExp(`\\{${prop}\\}`, "gi"),
      server[prop]?.toString() || ""
    );
  }
  return str;
}

const OPT_TITLE: (keyof UpdateOptions)[] = ["title", "offlineTitle"];
const OPT_DESCRIPTION: (keyof UpdateOptions)[] = [
  "description",
  "offlineDescription",
];
const OPT_COLOR: (keyof UpdateOptions)[] = ["color", "offlineColor"];
const OPT_IMAGE: (keyof UpdateOptions)[] = ["image", "offlineImage"];

export async function generateEmbed(
  update: Update,
  server: State,
  tick: number
): Promise<MessageEmbed> {
  const players = server.realPlayers === null ? [] : server.realPlayers;

  const isOffline = server.offline ? 1 : 0;

  const embed = new MessageEmbed({
    title: serverFormat(
      update.getOption(OPT_TITLE[isOffline]) as string,
      server
    ),
    description: serverFormat(
      update.getOption(OPT_DESCRIPTION[isOffline]) as string,
      server
    ),
    color: update.getOption(OPT_COLOR[isOffline]) as number,
    timestamp: Date.now(),
  });

  const dots = update.getOption("dots") as string[];
  embed.setFooter({ text: dots[tick % dots.length] });

  const image = update.getOption(OPT_IMAGE[isOffline]) as string;
  if (image.length > 0) embed.setThumbnail(image);

  const columns = update.getOption("columns") as number;
  const rows = Math.ceil(players.length / columns);

  for (let i = 0; i < columns; i++) {
    const column = players.splice(0, rows);
    if (column.length > 0) {
      const columnText = column.map((v: Player) => v.name).join("\n");
      embed.addField("_ _", columnText, true);
    }
  }

  return truncateEmbed(embed);
}
