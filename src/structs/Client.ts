/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2021-2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import Discord from "discord.js-light";

import UpdateCache from "./UpdateCache";
import Command from "./Command";
import { Limit } from "../limits";

export default class Client extends Discord.Client {
  updateCache: UpdateCache;
  commands: Map<string, Command>;
  config: ClientConfig;

  constructor(
    updateCache: UpdateCache,
    commands: Map<string, Command>,
    config: ClientConfig,
    options: Discord.ClientOptions
  ) {
    super(options);
    this.updateCache = updateCache;
    this.commands = commands;
    this.config = config;
  }
}

export interface ClientConfig {
  prefix: string;
  tickCount: number;
  tickTime: number;
  owner?: string;
  adminFlag: string;
  channelLimit?: number;
  guildLimit?: number;
  allowDuplicates: boolean;
  supportServer?: string;
  scheduler?: string;
  limitRules: { [guild: string]: { [role: string]: Limit } };
}
