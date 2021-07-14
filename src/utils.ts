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

import { is } from "@douile/bot-utilities";

import { Message } from "discord.js-light";

export async function channelFirstArg(message: Message, args: string[]) {
  if (args.length > 0) {
    const channelArg = is.discordChannel(args[0]);
    if (channelArg) {
      console.log("Fetching", channelArg);
      let channelFetch;
      try {
        channelFetch = await message.guild?.channels.fetch(channelArg);
      } catch {
        // nop, undefined is handled by if statement
      }
      if (channelFetch) {
        args.splice(0, 1);
        return channelFetch;
      } else {
        await message.channel.send({
          embed: {
            title: "Could not find specified channel",
            description: `Couldn't find <#${channelArg}>`,
            color: 0xff0000
          }
        });
        return undefined;
      }
    }
  }

  return message.channel;
}

/**
 * Convert an async generator to an array
 * @returns {any[]} array
 */
export async function asyncArray<T>(
  asyncGenerator: AsyncGenerator<T>
): Promise<T[]> {
  const res: T[] = [];
  for await (let i of asyncGenerator) {
    res.push(i);
  }
  return res;
}