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

import { PermissionResolvable } from "discord.js-light";

import { CommandContext } from "./structs/CommandContext";

export type Check = (context: CommandContext) => boolean;

export function isAdmin(context: CommandContext): boolean {
  const member = context.member();
  if (!member) return false;
  return member.permissions.has(
    context.client().config.adminFlag as PermissionResolvable
  );
}

export function isOwner(context: CommandContext): boolean {
  const guild = context.guild();
  if (!guild) return false;
  return guild.ownerId === context.user().id;
}

export function isBotOwner(context: CommandContext): boolean {
  return context.client().config.owner === context.user().id;
}

export function isDMChannel(context: CommandContext): boolean {
  return context.channel()?.type === "DM";
}

export function combineAll(...checks: Check[]): Check {
  return function (context: CommandContext) {
    for (const check of checks) {
      if (!check(context)) return false;
    }
    return true;
  };
}

export function combineAny(...checks: Check[]): Check {
  return function (context: CommandContext) {
    for (const check of checks) {
      if (check(context)) return true;
    }
    return false;
  };
}
