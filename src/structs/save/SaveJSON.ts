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

import { promises as fs } from "fs";

import { Collection } from "discord.js-light";
import { isOfBaseType } from "@douile/bot-utilities";


import SaveInterface, {
  GetOpts,
  DeleteOpts,
  eitherSelector,
  Selector
} from "./SaveInterface";
import Update from "../Update";
import { UpdateOptions } from "../Update/UpdateOptions";
import Serializable from "../Serializable";
import { infoLog, errorLog } from "../../debug";

type SerializedUpdate = {
  guild?: string,
  channel?: string,
  message?: string,
  state?: any,
  type: string,
  ip: string,
  name: string,
  options: UpdateOptions,
};

type SerializedStore = {
  [channel: string]: SerializedUpdate[],
};

export default class SaveJSON implements SaveInterface {
  private filename: string;
  private saveTimeout: number;

  private _saveTimer: NodeJS.Timeout | null;
  private _saveInProgress: Promise<void> | null;
  private _requeueWhenDone: boolean;
  private _cache: Collection<string, Update[]>;

  constructor(filename = "_save.json") {
    this.filename = filename;
    this.saveTimeout = 30000; // 30 secs

    this._saveTimer = null;
    this._saveInProgress = null;
    this._requeueWhenDone = false;
    this._cache = new Collection();
  }

  async load(): Promise<void> {
    let r;
    try {
      r = await this._load();
    } catch (e) {
      if (e.code === "ENOENT") {
        console.warn("No save file found, starting new save file");
      } else {
        throw e;
      }
    }
    return r;
  }

  close(): Promise<void> {
    if (this._saveTimer !== null) {
      if (this._saveInProgress !== null) {
        return this._saveInProgress;
      } else {
        clearTimeout(this._saveTimer);
      }
    }
    return this._save();
  }

  get(opts: GetOpts): Update[] {
    if (opts.message !== undefined) {
      // Very slow
      return Array.from(this._cache.values())
        .flat()
        .filter(i => i.message === opts.message);
    } else if (opts.channel !== undefined) {
      return this._cache.get(opts.channel) || [];
    } else if (opts.guild !== undefined) {
      // Very slow
      return Array.from(this._cache.values())
        .flat()
        .filter(i => i.guild === opts.guild);
    } else {
      throw new Error("Must specify a search param when getting statuses");
    }
  }

  update(status: Update): boolean {
    if (!status.channel) throw new Error("Status has no channel");
    const cached = this._cache.get(status.channel);
    if (!cached) throw new Error("No such StatusUpdate exists");

    let found = false;
    for (let i = 0; i < cached.length; i++) {
      if (
        cached[i].ip === status.ip &&
        cached[i].guild === status.guild &&
        cached[i].channel === status.channel
      ) {
        found = true;
        cached[i] = status;
        break;
      }
    }
    this.queueSave();
    return found;
  }

  create(status: Update): boolean {
    if (!status.channel) throw new Error("Status has no channel");
    if (this._cache.has(status.channel)) {
      const cached = this._cache.get(status.channel);
      if (
        !cached ||
        cached.some(
          s =>
            s.ip === status.ip &&
            s.guild === status.guild &&
            s.channel === status.channel
        )
      )
        return false;

      this._cache.set(status.channel, cached.concat([status]));
    } else {
      this._cache.set(status.channel, [status]);
    }
    this.queueSave();
    return true;
  }

  delete(opts: Update | DeleteOpts): number {
    // Here we don't use guild as channel IDs are unique and the key we use,
    // however guild is checked to be specified to maintain consitency with
    // SavePSQL
    if (opts.guild === undefined || opts.channel === undefined) {
      throw new Error("Must specify search params when deleting statuses");
    }

    let selector: Selector | undefined = undefined;
    if (opts instanceof Update || "ip" in opts || "message" in opts) {
      selector = eitherSelector(opts);
    }

    let deleted = -1;
    if (selector) {
      const s = selector;
      const l = this._cache.get(opts.channel) || [];
      const n = l.filter(i => i[s.key] !== s.value);
      if (n.length > 0) {
        this._cache.set(opts.channel, n);
      } else {
        this._cache.delete(opts.channel);
      }
      deleted = l.length - n.length;
    } else {
      deleted = this._cache.get(opts.channel)?.length || 0;
      this._cache.delete(opts.channel);
    }

    this.queueSave();
    return deleted;
  }

  has(status: Update): boolean {
    const selector = eitherSelector(status);
    if (this._cache.has(status.channel as string)) {
      return (
        this._cache
          .get(status.channel as string)
          ?.some(i => i[selector.key] === selector.value) || false
      );
    }
    return false;
  }

  values(): IterableIterator<Update[]> {
    return this._cache.values();
  }

  entries(): IterableIterator<[string, Update[]]> {
    return this._cache.entries();
  }

  /*****************************************************************************
   *** Helpers
   *****************************************************************************/

  queueSave(): void {
    if (this._saveTimer !== null) {
      if (this._saveInProgress !== null) this._requeueWhenDone = true;
    } else {
      this._saveTimer = setTimeout(this.save.bind(this), this.saveTimeout);
    }
  }

  save(): void {
    this._saveInProgress = this._save();
    this._saveInProgress
      .then(() => {
        this._saveTimer = null;
        this._saveInProgress = null;
        if (this._requeueWhenDone) {
          this.queueSave();
          this._requeueWhenDone = false;
        }
      })
      .catch((...args: unknown[]) => {
        console.error(...args);
        this._saveTimer = null;
        this._saveInProgress = null;
        this.queueSave();
        this._requeueWhenDone = false;
      });
  }
  async _save(): Promise<void> {
    const obj = {};

    const promises = [];
    for (const [key, item] of this._cache.entries()) {
      promises.push(this.serializeItem(obj, key, item));
    }
    await Promise.allSettled(promises);
    const content = JSON.stringify(obj);
    await fs.writeFile(this.filename, content);
  }

  async serializeItem(
    obj: any,
    key: string | number,
    item: any,
  ): Promise<boolean> {
    if (isOfBaseType(item, Array)) {
      obj[key] = new Array(item.length);
      for (let i = 0; i < item.length; i++) {
        await this.serializeItem(obj[key], i, item[i]);
      }
    } else if (isOfBaseType(item, Object)) {
      // NOTE: Maybe we shouldn't deal with this cases as Serializables are transformed into objects
      obj[key] = {};
      for (const i in item) {
        await this.serializeItem(obj[key], i, item[i]);
      }
    } else if (item instanceof Serializable) {
      obj[key] = item.serialize();
    }
    return true;
  }

  async _load(): Promise<void> {
    const content = await fs.readFile(this.filename, { encoding: "utf-8" });
    let obj: SerializedStore;
    try {
      obj = JSON.parse(content);
    } catch (e) {
      await fs.copyFile(this.filename, `${this.filename}.damaged`);
      throw e;
    }
    this._cache.clear();

    const promises = [];
    for (const [key, item] of Object.entries(obj)) {
      promises.push(this.parseItem(key, item));
    }
    const res = await Promise.allSettled(promises);
    const errs = res.filter(v => v.status === 'rejected');
    infoLog(`Loaded ${promises.length} configs...`);
    if (errs.length > 0) {
      errorLog(errs);
      await fs.copyFile(this.filename, `${this.filename}.damaged`);
    }
  }

  async parseItem(key: string, item: SerializedUpdate | SerializedUpdate[]): Promise<boolean> {
    let res: Update[];
    if (item instanceof Array) {
      res = new Array(item.length);
      for (let i = 0; i < item.length; i++) {
        res[i] = new Update(item[i]);
      }
    } else {
      res = [new Update(item)];
    }
    this._cache.set(key, res);
    return true;
  }
}
