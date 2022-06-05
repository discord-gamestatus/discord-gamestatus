/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { ApplicationCommandOptionData } from "discord.js-light";

import Message from "../structs/Message";
import { isAdmin } from "../checks";

export const name = "activateguild";
export const check = isAdmin;
export const help = "Set/remove the user who's limits are used for the current guild";
export const options: ApplicationCommandOptionData[] = [
  {
    name: "mode",
    description: "Whether to set or remove your activation",
    type: "STRING",
    choices: [
      { name: "Set", value: "set" },
      { name: "Remove", value: "remove" },
    ],
  },
];
export async function call(message: Message, parts: string[]): Promise<void> {
  if (!message.guild) {
    await message.reply("You can only activate in a server");
    return;
  }

  let isSetting = true;
  if (parts.length > 0) {
    if (parts[0].match(/remove/i) !== null) isSetting = false;
  }

  return isSetting
    ? await addActivation(message)
    : await removeActivation(message);
}

async function addActivation(message: Message): Promise<void> {
  // FIXME: Check they're not exceeding limit

  const success =
    await message.client.updateCache.saveInterface.addUserActivation(
      message.author.id,
      message.guild?.id as string
    );

  await message.reply(
    success
      ? "Successfully added activation"
      : "Unable to add activation to this guild"
  );
}

async function removeActivation(message: Message): Promise<void> {
  const success =
    await message.client.updateCache.saveInterface.removeUserActivation(
      message.guild?.id as string
    );

  await message.reply(
    success
      ? "Successfully removed activation"
      : "Unable to remove activation from this guild"
  );
}
