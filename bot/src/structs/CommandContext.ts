/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2023 Douile

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
  CommandInteraction,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessageEmbed,
  ReplyMessageOptions,
  TextBasedChannel,
  User,
} from "discord.js-light";
import { APIEmbed } from "discord-api-types/v10";
import Client from "./Client";
import SaveInterface from "./save/SaveInterface";
import UpdateCache from "./UpdateCache";

export interface ReplyOptions {
  content?: string;
  embeds?: MessageEmbed[] | APIEmbed[];
  ephemeral?: boolean;
}

export interface DeferReplyOptions extends InteractionReplyOptions {
  content: string;
}

//export type OptionType = number | string | boolean | undefined;
export type OptionType = string;

export interface CommandContext {
  reply: (options: ReplyOptions) => Promise<Message | void>;
  deferReply: (options: DeferReplyOptions) => Promise<void>;
  editReply: (options: ReplyOptions) => Promise<void>;

  command: () => string;
  user: () => User;
  member: () => GuildMember | null;
  guild: () => Guild | null;
  channel: () => TextBasedChannel | null;

  client: () => Client;
  updateCache: () => UpdateCache;
  saveInterface: () => SaveInterface;

  intoGuildContext: () => GuildCommandContext | null;
}

export interface GuildCommandContext extends CommandContext {
  member: () => GuildMember;
  guild: () => Guild;
}

export class CommandInteractionContext implements CommandContext {
  protected data: CommandInteraction;

  constructor(interaction: CommandInteraction) {
    this.data = interaction;
  }

  reply(options: InteractionReplyOptions) {
    return this.data.reply(options);
  }

  deferReply(options: DeferReplyOptions) {
    return this.data.deferReply(options);
  }

  async editReply(options: ReplyOptions) {
    await this.data.editReply(options);
  }

  command() {
    return this.data.commandName;
  }

  options() {
    return this.data.options.data.map((v) => v.value);
  }

  user() {
    return this.data.user;
  }

  member() {
    // FIXME: Types
    return this.data.member as GuildMember | null;
  }

  guild() {
    return this.data.guild;
  }

  channel() {
    return this.data.channel;
  }

  client() {
    return this.data.client as Client;
  }

  updateCache() {
    return this.client().updateCache;
  }

  saveInterface() {
    return this.updateCache().saveInterface;
  }

  intoGuildContext(): GuildCommandInteractionContext | null {
    if (this.data.member && this.data.guild)
      return GuildCommandInteractionContext.fromCommandInteractionContext(this);
    return null;
  }

  inner(): CommandInteraction {
    return this.data;
  }
}

export class GuildCommandInteractionContext
  extends CommandInteractionContext
  implements GuildCommandInteractionContext
{
  static fromCommandInteractionContext(
    context: CommandInteractionContext
  ): GuildCommandInteractionContext {
    return new GuildCommandInteractionContext(context.inner());
  }
  member() {
    return this.data.member as GuildMember;
  }

  guild() {
    return this.data.guild as Guild;
  }
}

export class MessageContext implements CommandContext {
  protected data: Message;
  private commandName: string;
  private parts: string[];
  private _reply: Message | null;

  constructor(message: Message, commandName: string, parts: string[]) {
    this.data = message;
    this.commandName = commandName;
    this.parts = parts;
    this._reply = null;
  }

  reply(options: ReplyMessageOptions) {
    return this.data.reply(options);
  }

  async deferReply(options: DeferReplyOptions) {
    this._reply = await this.reply({
      content: options.content,
    });
  }

  async editReply(options: ReplyOptions) {
    if (this._reply) {
      await this._reply.edit(options);
    }
  }

  command() {
    return this.commandName;
  }

  options() {
    return this.parts;
  }

  user() {
    return this.data.author;
  }

  member() {
    return this.data.member;
  }

  guild() {
    return this.data.guild;
  }

  channel() {
    return this.data.channel;
  }

  client() {
    return this.data.client as Client;
  }

  updateCache() {
    return this.client().updateCache;
  }

  saveInterface() {
    return this.updateCache().saveInterface;
  }

  intoGuildContext(): GuildMessageContext | null {
    if (this.data.member && this.data.guild)
      return GuildMessageContext.fromMessageContext(this);
    return null;
  }

  inner(): Message {
    return this.data;
  }
}

export class GuildMessageContext
  extends MessageContext
  implements GuildCommandContext
{
  static fromMessageContext(context: MessageContext): GuildMessageContext {
    return new GuildMessageContext(
      context.inner(),
      context.command(),
      context.options()
    );
  }

  member() {
    return this.data.member as GuildMember;
  }

  guild() {
    return this.data.guild as Guild;
  }
}
