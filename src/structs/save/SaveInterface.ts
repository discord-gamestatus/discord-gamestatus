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

import Update from "../Update";
import { Snowflake } from "discord.js-light";

export interface GetOpts {
  message?: string;
  channel?: string;
  guild: string;
}

export interface DeleteOpts {
  message?: string;
  ip?: string;
  channel: string;
  guild: string;
}

export interface Selector {
  key: "ip" | "message_id";
  value: string;
}

export function eitherSelector(update: Update | DeleteOpts): Selector {
  if (update.ip !== undefined) return { key: "ip", value: update.ip };
  if (update.message !== undefined)
    return { key: "message_id", value: update.message };
  throw new Error(`Not enough identifiers for ${update}`);
}

/* Abstract base class
All getters/setters are optionally async
*/
export default interface SaveInterface {
  /**
   * Called when bot closes
   * Should save all data and close all connections
   */
  close(): Promise<void>;

  /**
   * Called when bot starts
   * Can be used to initialize data
   */
  load(): Promise<void>;

  /**
   * Get statuses with given query
   */
  get(opts: GetOpts): Promise<Update[]> | Update[];

  /**
   * Add a status to the datastore
   */
  create(status: Update): Promise<boolean> | boolean;

  /**
   * Update the information for a status in the datastore
   */
  update(status: Update): Promise<boolean> | boolean;

  /**
   * Delete a status
   * @return {number} The number of statuses deleted (or -1 if an error occurred)
   */
  delete(opts: Update | DeleteOpts): Promise<number> | number;

  /**
   * Check if a status is in the datastore
   */
  has(status: Update): Promise<boolean> | boolean;

  /**
   * Get values iterator
   */
  values(): Promise<Update[][]> | IterableIterator<Update[]>;

  /**
   * Get entries
   */
  entries():
    | Promise<Array<[string, Array<Update>]>>
    | IterableIterator<[string, Array<Update>]>;

  /**
   * Get the user who activated there limits in a guild
   */
  getGuildActivation(guild: Snowflake): Promise<undefined | Snowflake>;

  /**
   * Get the number of guilds a user has activated
   */
  getUserActivationCount(user: Snowflake): Promise<number>;

  /**
   * Add a guild activation
   */
  addUserActivation(user: Snowflake, guild: Snowflake): Promise<boolean>;

  /**
   * Remove a user activation
   */
  removeUserActivation(guild: Snowflake): Promise<boolean>;
}
