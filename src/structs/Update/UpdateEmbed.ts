/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2021 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { MessageEmbed, MessageAttachment } from "discord.js-light";
import { truncateEmbed } from "@douile/bot-utilities";
import { Player } from "gamedig";

import Update from "../Update";
import { UpdateOptions } from "./UpdateOptions";
import { FORMAT_PROPERTIES } from "../../constants";
import { State } from "../../query";

function serverFormat(string: string, server: State) {
  for (let prop of <[keyof State]>FORMAT_PROPERTIES) {
    string = string.replace(
      new RegExp(`\\{${prop}\\}`, "gi"),
      <any>server[prop]
    );
  }
  return string;
}

const OPT_TITLE: (keyof UpdateOptions)[] = ["title", "offlineTitle"];
const OPT_DESCRIPTION: (keyof UpdateOptions)[] = [
  "description",
  "offlineDescription"
];
const OPT_COLOR: (keyof UpdateOptions)[] = ["color", "offlineColor"];
const OPT_IMAGE: (keyof UpdateOptions)[] = ["image", "offlineImage"];

export async function generateEmbed(
  update: Update,
  server: State,
  tick: number
) {
  let players = server.realPlayers === null ? [] : server.realPlayers;

  const isOffline = server.offline ? 1 : 0;

  let embed = new MessageEmbed({
    title: serverFormat(
      update.getOption(OPT_TITLE[isOffline]) as string,
      server
    ),
    description: serverFormat(
      update.getOption(OPT_DESCRIPTION[isOffline]) as string,
      server
    ),
    color: update.getOption(OPT_COLOR[isOffline]) as number,
    timestamp: Date.now()
  });

  let dots = update.getOption("dots") as string[];
  embed.setFooter(dots[tick % dots.length]);

  let image = server.image;
  const selectedImage = update.getOption(OPT_IMAGE[isOffline]) as string;
  if (selectedImage.length > 0) image = { type: "url", url: selectedImage };

  if (image) {
    let embedImage = undefined;
    switch (image.type) {
      case "buffer": {
        const name = `image.${image.dataType}`;
        embed.attachFiles([new MessageAttachment(image.buffer, name)]);
        embedImage = `attachment://${name}`;
        break;
      }
      case "url": {
        embedImage = image.url;
        break;
      }
    }
    embed.setThumbnail(embedImage);
  }

  let columns = update.getOption("columns") as number;
  let rows = Math.ceil(players.length / columns);

  for (let i = 0; i < columns; i++) {
    let column = players.splice(0, rows);
    if (column.length > 0) {
      const columnText = column.map((v: Player) => v.name).join("\n");
      embed.addField("_ _", columnText, true);
    }
  }

  return truncateEmbed(embed);
}
