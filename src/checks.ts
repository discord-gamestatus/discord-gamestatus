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

import { PermissionResolvable } from "discord.js-light";

import Message from "./structs/Message";

export type Check = (message: Message) => boolean;

export function isAdmin(message: Message): boolean {
  if (!message.member) return false;
  return message.member.hasPermission(
    message.client.config.adminFlag as PermissionResolvable
  );
}

export function isOwner(message: Message): boolean {
  if (!message.guild) return false;
  return message.guild.ownerID === message.author.id;
}

export function isBotOwner(message: Message): boolean {
  return message.client.config.owner === message.author.id;
}

export function isDMChannel(message: Message): boolean {
  return message.channel.type === "dm";
}

export function combineAll(...checks: Check[]): Check {
  return function(message: Message) {
    for (const check of checks) {
      if (!check(message)) return false;
    }
    return true;
  };
}

export function combineAny(...checks: Check[]): Check {
  return function(message: Message) {
    for (const check of checks) {
      if (check(message)) return true;
    }
    return false;
  };
}
