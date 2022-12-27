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

import fs from "fs/promises";

import { is } from "@douile/bot-utilities";

import { Message, TextBasedChannel } from "discord.js-light";
import postgres from "pg";

import {
  CommandContext,
  MessageContext,
  CommandInteractionContext,
} from "./structs/CommandContext";

export async function channelFirstArg(
  message: Message,
  args: string[]
): Promise<TextBasedChannel | undefined> {
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
        return channelFetch as TextBasedChannel;
      } else {
        await message.channel.send({
          embeds: [
            {
              title: "Could not find specified channel",
              description: `Couldn't find <#${channelArg}>`,
              color: 0xff0000,
            },
          ],
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
  for await (const i of asyncGenerator) {
    res.push(i);
  }
  return res;
}

/**
 * Assign a property to an object
 * https://codeutility.org/how-do-i-dynamically-assign-properties-to-an-object-in-typescript-stack-overflow/
 */
export function assign<T extends object, U>(
  target: T,
  source: U
): asserts target is T & U {
  Object.assign(target, source);
}

/**
 * Convert a context into search fields
 */
export function getSearch(
  context: CommandContext,
  optionName: string,
  flags = "i"
): RegExp[] {
  if (context instanceof MessageContext) {
    return context.options().length > 0
      ? context.options().map((s) => new RegExp(s, flags))
      : [];
  }
  if (context instanceof CommandInteractionContext) {
    const search = context.inner().options.getString(optionName, false);
    return search ? search.split(" ").map((s) => new RegExp(s, "i")) : [];
  }
  throw new Error("unreachable");
}

/**
 * Attempt to read the given file and parse it as JSON
 * returns {} if the file does not exist or if it contains
 * invalid JSON
 */
export function readJSONOrEmpty(fileName: string) {
  return new Promise((resolve) => {
    fs.readFile(fileName, { encoding: "utf-8" })
      .then((content) => {
        let data = {};
        try {
          data = JSON.parse(content);
        } catch (e) {
          console.warn("Error parsing JSON", e);
        }
        resolve(data);
      })
      .catch(() => {
        resolve({});
      });
  });
}

/**
 * Throw an error if the database schema version is lower than required or not set
 */
export async function throwForSchemaVersion(
  pg: { query: postgres.Client["query"] },
  requiredVersion: number
) {
  const r = await pg.query("SELECT version FROM schema_version", []);

  if (r.rows.length === 0) {
    throw new Error(
      "Unable to check schema version, please check the database is set up correctly"
    );
  } else {
    const version = r.rows[0].version;
    if (version < requiredVersion) {
      throw new Error(
        `Schema version ${version} is lower than the required schema version ${requiredVersion}, please upgrade`
      );
    }
  }
}
