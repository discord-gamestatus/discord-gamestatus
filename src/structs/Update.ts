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

import {
  Snowflake,
  TextChannel,
  Message,
  HTTPError,
} from "discord.js-light";
import { Guild } from "discord.js";
import { performance } from "perf_hooks";
import { Type } from "gamedig";

import { isOfBaseType } from "@douile/bot-utilities";

import Client from "./Client";
import Serializable from "./Serializable";
import { debugLog, infoLog, warnLog, verboseLog } from "../debug";
import {
  UpdateOptions,
  UpdateOption,
  DEFAULT_OPTIONS
} from "./Update/UpdateOptions";
import { generateEmbed } from "./Update/UpdateEmbed";
import stateChanges, { Changes, PlayerChange } from "../stateChanges";
import { query, State } from "../query";
import { assign } from "../utils";


export interface UpdateConstructorOptions {
  guild?: Snowflake;
  channel?: Snowflake;
  message?: Snowflake;
  type: string;
  ip: string;
  name: string;
  options?: UpdateOptions;
}

export interface UpdateConstructorObjects {
  guild?: Guild;
  channel?: TextChannel;
  message?: Message;
}

export default class Update extends Serializable {
  public _deleted: boolean;
  private _shouldDelete: boolean;
  public _dontAutoSave: boolean;

  public guild: Snowflake | undefined;
  private _guild: Guild | undefined;

  public channel: Snowflake | undefined;
  private _channel: TextChannel | undefined;

  public message: Snowflake | undefined;
  private _message: Message | undefined;

  public state: Partial<State>;

  public type: string;
  public ip: string;
  public name: string;
  public options: UpdateOptions = {};

  constructor(opts?: UpdateConstructorOptions, objs?: UpdateConstructorObjects) {
    super();

    this._deleted = false;
    this._shouldDelete = false;
    this._dontAutoSave = false;

    /* Serializable.parse will not provide opts */
    this.guild = opts?.guild;
    this.channel = opts?.channel;
    this.message = opts?.message;
    this.state = {};
    this.type = opts?.type || 'Error';
    this.ip = opts?.ip || 'Error';
    this.name = opts?.name || 'Error';
    this.options = opts?.options || {};

    if (objs) {
      this._guild = objs.guild;
      this._channel = objs.channel;
      this._message = objs.message;

      if (this._message) {
        this._channel = this._message.channel as TextChannel;
        this._guild = this._message.guild || undefined;
      } else if (this._channel) {
        this._guild = this._channel.guild;
      }

      if (this._guild) this.guild = this._guild.id;
      if (this._channel) this.channel = this._channel.id;
      if (this._message) this.message = this._message.id;
    } else {
      this._guild = undefined;
      this._channel = undefined;
      this._message = undefined;
    }
  }

  ID(): string {
    return `${this.guild}:${this.channel}:${this.ip}`;
  }

  /*******************************************************************************
   *** Properties
   *******************************************************************************/

  async getGuild(client: Client, dontForge = false): Promise<Guild | undefined> {
    if (this._guild) return this._guild;
    if (dontForge) {
      this._guild = this.guild
        ? await client.guilds.fetch(this.guild)
        : undefined;
      return this._guild;
    }
    return this.guild ? client.guilds.forge(this.guild) : undefined;
  }

  async getChannel(
    client: Client,
    dontForge = false
  ): Promise<TextChannel | undefined> {
    if (this._channel) return this._channel;
    const guild = await this.getGuild(client, dontForge);
    if (dontForge) {
      this._channel =
        guild && this.channel
          ? ((await client.channels.fetch(this.channel)) as TextChannel)
          : undefined;
      return this._channel;
    }
    return guild && this.channel
      ? guild.channels.forge(this.channel, "GUILD_TEXT")
      : undefined;
  }

  async getMessage(
    client: Client,
    dontForge = false
  ): Promise<Message | undefined> {
    if (this._message) return this._message;
    const channel = await this.getChannel(client, dontForge);
    if (dontForge) {
      try {
        this._message =
          channel && this.message
            ? await channel.messages.fetch(this.message)
            : undefined;
      } catch (e) {
        verboseLog(e);
        return undefined;
      }
      return this._message;
    }
    return channel && this.message
      ? channel.messages.forge(this.message)
      : undefined;
  }

  async setGuild(client: Client, guild: Guild | Snowflake): Promise<void> {
    const oldGuild = this.guild;
    if (guild instanceof Guild) {
      this.guild = guild.id;
      this._guild = guild;
    } else {
      this.guild = guild;
      this._guild = undefined;
    }
    if (oldGuild !== this.guild && !this._dontAutoSave) {
      await client.updateCache.update(this);
    }
  }

  async setChannel(
    client: Client,
    channel: TextChannel | Snowflake
  ): Promise<void> {
    const oldChannel = this.channel;
    if (channel instanceof TextChannel) {
      this.channel = channel.id;
      this._channel = channel;
    } else {
      this.channel = channel;
      this._channel = undefined;
    }
    if (oldChannel !== this.channel && !this._dontAutoSave) {
      await client.updateCache.update(this);
    }
  }

  async setMessage(
    client: Client,
    message: Message | Snowflake | undefined
  ): Promise<void> {
    const oldMessage = this.message;
    if (message instanceof Message) {
      this.message = message.id;
      this._message = message;
    } else {
      this.message = message;
      this._message = undefined;
    }
    if (oldMessage !== this.message && !this._dontAutoSave) {
      await client.updateCache.update(this);
    }
  }

  async shouldDelete(client: Client): Promise<boolean> {
    if (this._shouldDelete === true) return true;
    const guild = await this.getGuild(client);
    if (guild === undefined || guild.deleted) return true;
    const channel = await this.getChannel(client);
    if (channel === undefined || channel.deleted) return true;
    /* Permissions not checked here as the status will delete itself if it gets
     *  lack of permission error code when updating */
    return false;
  }

  messageLink(): string {
    return `https://discordapp.com/channels/${this.guild}/${this.channel}/${this.message}`;
  }

  /*******************************************************************************
   *** Options
   *******************************************************************************/

  getOption<P extends UpdateOption>(optionName: P): UpdateOptions[P] {
    return isOfBaseType(this.options, Object)
      ? optionName in this.options
        ? this.options[optionName] || DEFAULT_OPTIONS[optionName]
        : DEFAULT_OPTIONS[optionName]
      : DEFAULT_OPTIONS[optionName];
  }

  getOptions(): UpdateOptions {
    let res: UpdateOptions = {};
    let prop: UpdateOption;
    for (prop in DEFAULT_OPTIONS) {
      res = {
        [prop]: this.getOption(prop),
        ...res,
      };
    }
    return res;
  }

  setOption(
    client: Client | undefined,
    optionName: UpdateOption,
    value: UpdateOptions[UpdateOption],
    dontSave = false
  ): Promise<boolean> | boolean | void {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    /* Use DEFAULT_OPTIONS constructors to typecast new value */
    // TODO: Add better support for setting arrays
    let newValue: unknown = value;
    if (newValue !== null && newValue !== undefined) {

      newValue = Object.getPrototypeOf(DEFAULT_OPTIONS[optionName] as unknown).constructor(
        value
      );
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Number) && isNaN(newValue as number))
        newValue = null;
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Boolean)) {
        if (isOfBaseType(value, String)) {
          newValue = ["1", "true", "t", "yes", "y"].includes(
            (value as string)
              .toLowerCase()
              .trim()
              .split(" ")[0]
          );
        }
      }
      if (isOfBaseType(DEFAULT_OPTIONS[optionName], Array)) {
        if (isOfBaseType(value, String)) {
          newValue = (value as string).split(" ");
        } else if (isOfBaseType(value, Array)) {
          newValue = value;
        }
      }
      if (
        !isOfBaseType(
          newValue,
          Object.getPrototypeOf(DEFAULT_OPTIONS[optionName] as unknown).constructor
        )
      )
        newValue = null;
    }
    if (newValue === DEFAULT_OPTIONS[optionName] || newValue === null || newValue === undefined) {
      delete this.options[optionName];
    } else {
      assign(this.options, { [optionName]: newValue });
    }
    if (client && !dontSave && !this._dontAutoSave)
      return client.updateCache.update(this);
  }

  async deleteOption(client: Client, optionName: UpdateOption): Promise<void> {
    if (!isOfBaseType(this.options, Object)) this.options = {};
    delete this.options[optionName];
    if (!this._dontAutoSave) await client.updateCache.update(this);
  }

  parse(object: any): Update {
    const result = new Update(object);

    const options = object?.options || {};
    delete object["options"];
    for (const key in options) {
      if (key in DEFAULT_OPTIONS) {
        result.setOption(undefined, key as keyof UpdateOptions, options[key], true);
      }
    }

    return Object.defineProperties(
      result,
      Object.getOwnPropertyDescriptors(object)
    );
  }

  /*******************************************************************************
   *** Send
   *******************************************************************************/

  async send(client: Client, tick: number): Promise<State | undefined> {
    if (this._deleted) return;

    const _start = performance.now();

    if (!tick) tick = 0;

    const prevState = this.state;
    const boundQuery = query.bind(client);
    const state = await boundQuery(this.type as Type, this.ip);
    assign(this.state, {
      players: state.realPlayers ? state.realPlayers.map(v => v.name) : null,
      offline: state.offline,
      map: state.map
    });
    if (!state.offline) this.name = state.name;

    const changes = stateChanges(this.state, prevState);

    try {
      await this.sendUpdate(client, tick, state, changes);
    } catch (e) {
      if (e instanceof Error)
        warnLog("Error sending update", e, e.stack);
    }

    const _end = performance.now();
    verboseLog(`Update completed in ${_end - _start}ms`);
    return state;
  }

  async sendUpdate(
    client: Client,
    tick: number,
    state: State,
    changes: Changes
  ): Promise<void> {
    const embed = await generateEmbed(this, state, tick);

    let changesToSend: PlayerChange[] = [];
    if (this.getOption("connectUpdate"))
      changesToSend = changesToSend.concat(changes.players.connect);
    if (this.getOption("disconnectUpdate"))
      changesToSend = changesToSend.concat(changes.players.disconnect);

    const messageData = {
      content: "",
      embeds: [embed],
    };
    if (changesToSend.length > 0) {
      messageData.content = changesToSend
        .map(v => v.msg)
        .join("\n")
        .substring(0, 500);

    }

    const message = await this.getMessage(client);
    let needsNewMessage = true;
    if (message) {
      needsNewMessage = false;
      try {
        await message.edit(messageData);
      } catch (e) {
        if (e instanceof HTTPError) {
          /* Unknown channel, Missing access, Lack permission */
          if ([10003, 50001, 50013].includes(e.code)) {
            infoLog(`Removing ${this.ID()} for ${e.code}`);
            await client.updateCache.delete(this); // Delete status
            try {
              await message.delete();
            } catch (e) {
              // DO NOTHING
            }
          } else if (e.code === 10008) {
            needsNewMessage = true;
          } else {
            verboseLog(`Error editing message ${message.id}`, e.code);
          }
        }
      }
    }

    if (needsNewMessage) {
      const channel = await this.getChannel(client);
      if (channel) {
        let newMessage: Message | undefined = undefined;
        try {
          // Ignore Message[] here as we know will only ever send 1 message
          newMessage = (await channel.send(messageData)) as Message;
        } catch (e) {
          if (e instanceof HTTPError) {
            /* Unknown channel, Missing access, Lack permission */
            if ([10003, 50001, 50013].includes(e.code)) {
              infoLog(`Removing ${this.ID()} for ${e.code}`);
              await client.updateCache.delete(this); // delete status
            } else {
              debugLog("Unable to send new update", e.code);
            }
          }
        }
        await this.setMessage(client, newMessage);
      }
    }
  }

  async deleteMessage(client: Client, message?: Message): Promise<Message | undefined> {
    if (!message) message = await this.getMessage(client);
    if (!message) return;
    try {
      await message.delete();
    } catch (e) {
      if (e instanceof HTTPError) {
        verboseLog(`Unable to delete message ${message.id}`, e.code);
      }
    }
    return message;
  }
}
