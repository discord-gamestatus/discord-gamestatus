/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2020-2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { isBotOwner } from "../checks";
import { EMBED_COLOR } from "../constants";
import { asyncArray } from "../utils";
import {CommandContext} from "../structs/CommandContext";

export const name = "tickdebug";
export const check = isBotOwner;
export const help = "Debug status updates`";
export const disableSlash = true;

export async function call(context: CommandContext): Promise<void> {
  const config = context.client().config;

  let i = 0;
  let total = 0;
  const ticks = await asyncArray(
    context.updateCache().tickIterable(config.tickCount)
  );
  const tickList = Array.from(ticks)
    .map((tick) => {
      total += tick.length;
      return `${i++}: ${tick.length}`;
    })
    .join("\n");
  await context.reply({
    embeds: [
      {
        title: `Ticks: ${config.tickCount}`,
        description: `Total updates: ${total}\nAverage updates per tick: ${
          Math.round((total / i) * 1e3) / 1e3
        }\n\`\`\`\n${tickList}\`\`\``,
        color: EMBED_COLOR,
      },
    ],
  });
}
