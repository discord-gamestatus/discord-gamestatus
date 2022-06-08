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

export type OptionType = number | string | boolean | undefined;

export interface CommandContext {
  reply: (options: ReplyOptions) => Promise<Message | void>;
  command: () => string;
  options: () => OptionType[];
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
      return this as GuildCommandInteractionContext;
    return null;
  }
}

export class GuildCommandInteractionContext
  extends CommandInteractionContext
  implements GuildCommandInteractionContext
{
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

  constructor(message: Message, commandName: string, parts: string[]) {
    this.data = message;
    this.commandName = commandName;
    this.parts = parts;
  }

  reply(options: ReplyMessageOptions) {
    return this.data.reply(options);
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
    if (this.data.member && this.data.guild) return this as GuildMessageContext;
    return null;
  }
}

export class GuildMessageContext
  extends MessageContext
  implements GuildCommandContext
{
  member() {
    return this.data.member as GuildMember;
  }

  guild() {
    return this.data.guild as Guild;
  }
}
