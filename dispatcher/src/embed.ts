import { EmbedBuilder } from "@discordjs/builders";
import { truncateEmbed } from "@douile/bot-utilities";
import { Player } from "gamedig";

import { Update } from "./types.js";
import { State } from "./query.js";

export const FORMAT_PROPERTIES = Object.freeze([
  "name",
  "map",
  "numplayers",
  "validPlayers",
  "maxplayers",
  "connect",
]);

function serverFormat(str: string, server: State) {
  for (const prop of <[keyof State]>FORMAT_PROPERTIES) {
    str = str.replace(
      new RegExp(`\\{${prop}\\}`, "gi"),
      server[prop]?.toString() || ""
    );
  }
  return str;
}

const DEFAULT_OPTIONS = {
  dots: ["⚪", "⚫"],
  title: "{name} server status",
  offline_title: `server **{name}**`,
  description:
    "Playing {map} with {numplayers}/{maxplayers} players\nConnect with {connect}",
  offline_description: "Server is offline",
  color: 0x2894c2,
  offline_color: 0xff0000,
  image: "",
  offline_image: "",
  columns: 3,
  connectUpdate: false,
  disconnectUpdate: false,
};

export type UpdateOption = keyof Update & keyof typeof DEFAULT_OPTIONS;

const OPT_TITLE: UpdateOption[] = ["title", "offline_title"];
const OPT_DESCRIPTION: UpdateOption[] = ["description", "offline_description"];
const OPT_COLOR: UpdateOption[] = ["color", "offline_color"];
const OPT_IMAGE: UpdateOption[] = ["image", "offline_image"];

/**
 * Get option from update, if it is null return the default option
 */
function getOption<T>(update: Update, key: UpdateOption): T {
  // TODO: Enforce option limits
  return (update[key] || DEFAULT_OPTIONS[key]) as T;
}

export async function generateEmbed(
  update: Update,
  server: State,
  tick: number
): Promise<EmbedBuilder> {
  const players = server.realPlayers === null ? [] : server.realPlayers;

  const isOffline = server.offline ? 1 : 0;

  const embed = new EmbedBuilder({
    title: serverFormat(getOption(update, OPT_TITLE[isOffline]), server),
    description: serverFormat(
      getOption(update, OPT_DESCRIPTION[isOffline]),
      server
    ),
    color: getOption(update, OPT_COLOR[isOffline]),
  });
  embed.setTimestamp(Date.now());

  const dots: string[] = getOption(update, "dots");
  embed.setFooter({ text: dots[tick % dots.length] });

  const image: string = getOption(update, OPT_IMAGE[isOffline]);
  if (image.length > 0) embed.setThumbnail(image);

  const columns: number = getOption(update, "columns");
  const rows = Math.ceil(players.length / columns);

  for (let i = 0; i < columns; i++) {
    const column = players.splice(0, rows);
    if (column.length > 0) {
      const columnText = column.map((v: Player) => v.name).join("\n");
      embed.addFields({ name: "_ _", value: columnText, inline: true });
    }
  }

  return truncateEmbed(embed);
}
