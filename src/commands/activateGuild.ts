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

import { isAdmin } from "../checks";
import { getUserLimits } from "../limits";
import { EMBED_COLOR } from "../constants";
import { CommandContext, GuildCommandContext } from "../structs/CommandContext";

enum Mode {
  View,
  Set,
  Remove,
}

export const name = "activateguild";
export const check = isAdmin;
export const help =
  "Set/remove the user who's limits are used for the current guild";
export const options: ApplicationCommandOptionData[] = [
  {
    name: "mode",
    description: "Whether to set or remove your activation",
    type: "STRING",
    choices: [
      { name: "Set", value: "set" },
      { name: "Remove", value: "remove" },
      { name: "View", value: "view" },
    ],
    required: false,
  },
];
export async function call(context: CommandContext): Promise<void> {
  const guildContext = context.intoGuildContext();
  if (!guildContext) {
    await context.reply({
      content: "You can only activate in a server",
      ephemeral: true,
    });
    return;
  }

  let mode = Mode.View;
  for (const part of context.options()) {
    if (typeof part === "string") {
      if (part.match(/set/i) !== null) mode = Mode.Set;
      if (part.match(/rem/i) !== null) mode = Mode.Remove;
    }
  }

  switch (mode) {
    case Mode.Set:
      return addActivation(guildContext);
    case Mode.Remove:
      return removeActivation(guildContext);
    default:
    case Mode.View:
      return viewActivations(guildContext);
  }
}

async function viewActivations(context: GuildCommandContext): Promise<void> {
  const guildActivation = await context
    .saveInterface()
    .getGuildActivation(context.guild().id);
  const userLimits = await getUserLimits(context.client(), context.user().id);
  const userActivations = await context
    .saveInterface()
    .getUserActivationCount(context.user().id);

  await context.reply({
    embeds: [
      {
        title: "Activations",
        description: `This guild is currently activated by ${
          guildActivation ? `<@!${guildActivation}>` : "no-one"
        }\nYou have used ${userActivations}/${
          userLimits.limits?.activationLimit || 0
        } activations`,
        color: EMBED_COLOR,
      },
    ],
    ephemeral: true,
  });
}

async function addActivation(context: GuildCommandContext): Promise<void> {
  const limits = await getUserLimits(context.client(), context.user().id, true);

  if (limits.isDefault) {
    await context.reply({
      content: "You must have custom limit rules to activate a guild",
      ephemeral: true,
    });
    return;
  }

  const activationCount = await context
    .saveInterface()
    .getUserActivationCount(context.user().id);

  if (
    !limits.limits.activationLimit ||
    activationCount >= limits.limits.activationLimit
  ) {
    await context.reply({
      content: `You have reached your limit of ${activationCount} activated servers`,
      ephemeral: true,
    });
    return;
  }

  const success = await context
    .saveInterface()
    .addUserActivation(context.user().id, context.guild().id);

  await context.reply({
    content: success
      ? "Successfully added activation"
      : "Unable to add activation to this guild",
  });
}

async function removeActivation(context: GuildCommandContext): Promise<void> {
  const success = await context
    .saveInterface()
    .removeUserActivation(context.guild().id);

  await context.reply({
    content: success
      ? "Successfully removed activation"
      : "Unable to remove activation from this guild",
  });
}
