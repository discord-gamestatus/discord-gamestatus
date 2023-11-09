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

import Client from "./Client";

import { infoLog, warnLog, verboseLog } from "../debug";
import SaveInterface, { GetOpts, DeleteOpts } from "./save/SaveInterface";
import SavePSQL from "./save/SavePSQL";

import Update from "./Update";
import { getLimits } from "../limits";

export interface UpdateCacheOptions {
  database?: string;
  filename?: string;
}

export default class UpdateCache {
  saveInterface: SaveInterface;

  constructor(opts: UpdateCacheOptions) {
    let saveInterface: SaveInterface | undefined;
    if (opts.database && !SavePSQL)
      warnLog(
        `[UpdateCache] Not using database "${opts.database}" as "pg" is not installed`
      );
    if (opts.database && SavePSQL) {
      saveInterface = new SavePSQL(opts.database);
      infoLog(`[UpdateCache] Using PSQL`);
    }
    this.saveInterface = <SaveInterface>saveInterface;
  }

  async load(): Promise<void> {
    if (!this.saveInterface)
      throw new Error("No Save interface has been initialized");
    await this.saveInterface.load();
  }

  get(key: GetOpts): Update[] | Promise<Update[]> {
    return this.saveInterface.get(key);
  }

  create(status: Update): boolean | Promise<boolean> {
    verboseLog(`[UpdateCache] creating:`, status);
    return this.saveInterface.create(status);
  }

  update(status: Update): boolean | Promise<boolean> {
    verboseLog(`[UpdateCache] updating: ${status.ID()}`);
    return this.saveInterface.update(status);
  }

  has(value: Update): boolean | Promise<boolean> {
    return this.saveInterface.has(value);
  }

  delete(status: Update | DeleteOpts): number | Promise<number> {
    verboseLog(`[UpdateCache] deleting:`, status);
    return this.saveInterface.delete(status);
  }

  values(): Promise<Update[][]> | IterableIterator<Update[]> {
    return this.saveInterface.values();
  }

  entries():
    | Promise<[string, Update[]][]>
    | IterableIterator<[string, Update[]]> {
    return this.saveInterface.entries();
  }

  close(): Promise<void> {
    return this.saveInterface.close();
  }

  /*****************************************************************************
   *** Abstracted update functions
   *****************************************************************************/

  /**
   * Check if an update would be valid to add
   * @param update Update to check
   * @param client Discord.js Client object
   * @return String? Optional error message (undefined if no error)
   */
  async canAddUpdate(
    update: Update,
    client: Client
  ): Promise<string | undefined> {
    const guild = await update.getGuild(client);

    if (!guild) return "Unable to access guild";

    const guildUpdates = await this.get({ guild: guild.id });
    const guildUpdateCount = guildUpdates.length;
    let channelUpdateCount = 0;

    for (const u of guildUpdates) {
      if (u.ip === update.ip && !client.config.allowDuplicates)
        return `Sorry this server already has an update using the IP \`${update.ip}\``;

      if (u.channel === update.channel) channelUpdateCount++;
    }

    const { limits } = await getLimits(client, guild);

    if (
      !(
        isNaN(client.config.guildLimit || NaN) ||
        client.config.guildLimit === 0 ||
        (limits?.guildLimit && guildUpdateCount < limits.guildLimit)
      )
    ) {
      return `Sorry this server has reached its limit of ${limits?.guildLimit} active server statuses`;
    }

    if (
      !(
        isNaN(client.config.channelLimit || NaN) ||
        client.config.channelLimit === 0 ||
        (limits?.channelLimit && channelUpdateCount < limits.channelLimit)
      )
    ) {
      return `Sorry this channel has reached its limit of ${limits?.channelLimit} active server statuses`;
    }

    return undefined;
  }
}
