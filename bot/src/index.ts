/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2019-2023 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

import { promises as fs } from "node:fs";

import Discord from "discord.js-light";
import { errorWrap } from "@douile/bot-utilities";

import UpdateCache from "./structs/UpdateCache";
import Command from "./structs/Command";
import Client, { ClientConfig } from "./structs/Client";
import Message from "./structs/Message";
import { setDebugFlag, debugLog, verboseLog, errorLog, infoLog } from "./debug";
import { startDBLApiHook } from "./dblapi";
import {
  CommandInteractionContext,
  MessageContext,
} from "./structs/CommandContext";
import { readJSONOrEmpty } from "./utils";

const INVITE_FLAGS = [
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "ADD_REACTIONS",
];

const CLIENT_OPTIONS: Discord.ClientOptions = {
  makeCache: Discord.Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    ChannelManager: Infinity,
    GuildChannelManager: Infinity,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildManager: Infinity,
    GuildMemberManager: {
      maxSize: 0,
      keepOverLimit: (value) =>
        value.guild.id in (value.client as Client).config.limitRules,
    },
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    MessageManager: 0,
    PermissionOverwriteManager: Infinity,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    RoleManager: Infinity,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0,
  }),
  shards: "auto",
  restTimeOffset: 1000,
  presence: {
    status: "online",
    activities: [
      {
        type: "WATCHING",
        name: "always 👀",
      },
    ],
  },
  intents:
    Discord.Intents.FLAGS.GUILDS |
    Discord.Intents.FLAGS.GUILD_MESSAGES |
    Discord.Intents.FLAGS.DIRECT_MESSAGES |
    Discord.Intents.FLAGS.GUILD_MEMBERS,
  invalidRequestWarningInterval: 1,
  restGlobalRateLimit: 50, // Don't exceed discord's current rate limit
  retryLimit: 5,
};

const DEFAULT_CONFIG: ClientConfig = {
  prefix: "!",
  tickCount: 30,
  tickTime: 2000,
  owner: undefined,
  adminFlag: "ADMINISTRATOR",
  channelLimit: undefined,
  guildLimit: undefined,
  allowDuplicates: false,
  supportServer: undefined,
  blockLocalAddresses: true,
  limitRules: {},
};

async function loadCommands(commands: Map<string, Command>) {
  const files = await fs.readdir(`${__dirname}/commands`);
  async function loadCommand(file: string) {
    const command: Command = require(`./commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
    debugLog(`Loaded command ${command.name}`);
  }
  await Promise.all(files.map(loadCommand));
}

async function loadAdditionalConfigs(config: ClientConfig) {
  config.limitRules = (await readJSONOrEmpty(
    `${__dirname}/../limit-rules.json`
  )) as ClientConfig["limitRules"];
  verboseLog("Limit rules", config.limitRules);
}

/*******************************************************************************
 *** Event functions
 *******************************************************************************/

async function onMessage(oMessage: Discord.Message) {
  const message: Message = oMessage as Message;
  if (message.author.bot) return;
  if (!message.content.startsWith(message.client.config.prefix)) return;

  const parts = message.content
    .substring(message.client.config.prefix.length)
    .split(" ");
  if (parts.length === 0) return;
  const command = parts.splice(0, 1)[0].trim().toLowerCase();

  const cmd = message.client.commands.get(command);
  if (cmd) {
    debugLog(
      `[Command] ${message.author.username} [${
        message.author.id
      }] :: ${command} / ${parts.map((v) => `"${v}"`).join(", ")}`
    );

    const context = new MessageContext(message, command, parts);

    if (!(cmd.check instanceof Function) || cmd.check(context)) {
      try {
        await cmd.call(context);
      } catch (e) {
        errorLog(`Error running command ${command}\n`, e);
        await message.channel.send(
          "Sorry an error occured, please try again later"
        );
      }
    } else {
      await message.channel.send(
        "Sorry you don't have permission to use this command"
      );
    }

    return;
  }
  verboseLog(`Unkown command ${command}`);
}

async function onInteraction(interaction: Discord.Interaction) {
  if (!interaction.isCommand()) return;

  const context = new CommandInteractionContext(interaction);
  const cmd = (interaction.client as Client).commands.get(context.command());
  // TODO: Generalise command handling
  if (cmd) {
    if (!(cmd.check instanceof Function) || cmd.check(context)) {
      try {
        await cmd.call(context);
      } catch (e) {
        errorLog(`Error running interaction ${cmd.name}\n`, e);
        await interaction.reply({
          content: "Sorry an error occured, please try again later",
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: "Sorry you don't have permission to use this command",
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: `Unknown command \`${context.command()}\``,
      ephemeral: true,
    });
  }
}

export interface StartupConfig extends ClientConfig {
  error: boolean;
  warn: boolean;
  info: boolean;
  debug: boolean;
  verbose: boolean;
  database?: string;
  key: string;
  dblKey?: string;
}

export default async function start(config: StartupConfig): Promise<Client> {
  setDebugFlag(
    config.error,
    config.warn,
    config.info,
    config.debug,
    config.verbose
  );
  /* Override owner, prefix, tickCount, tickTime */
  const clientConfig: ClientConfig = {
    ...DEFAULT_CONFIG,
  };
  for (const [key, value] of Object.entries(config)) {
    if (value) {
      Object.assign(clientConfig, { [key]: value });
    }
  }

  let updateCache;
  if (config.database) {
    updateCache = new UpdateCache({
      database: config.database,
      filename: `${__dirname}/../_save.json`,
    });
  } else {
    updateCache = new UpdateCache({ filename: `${__dirname}/../_save.json` });
  }

  verboseLog("CONFIG", clientConfig);

  debugLog("DEBUG LOGS ENABLED");
  verboseLog("VERBOSE LOGS ENABLED");
  const commands: Map<string, Command> = new Map();
  await loadCommands(commands);
  await loadAdditionalConfigs(clientConfig);
  await updateCache.load();

  const client = new Client(
    updateCache,
    commands,
    clientConfig,
    CLIENT_OPTIONS
  );

  client.on(
    Discord.Constants.Events.MESSAGE_CREATE,
    errorWrap<[messsage: Discord.Message], unknown, unknown, void>(onMessage)
  );
  client.on(
    Discord.Constants.Events.INTERACTION_CREATE,
    errorWrap<[interaction: Discord.Interaction], unknown, unknown, void>(
      onInteraction
    )
  );
  client.on(
    Discord.Constants.Events.CLIENT_READY,
    errorWrap(async function () {
      infoLog(`Logged in ${client.user?.username} [${client.user?.id}]...`);
      const invite = client.generateInvite({
        scopes: ["bot"],
        permissions: <Discord.PermissionString[]>INVITE_FLAGS,
      });
      infoLog(`Invite link ${invite}`);

      if (client.config.owner === undefined) {
        const application = await client.application?.fetch();
        if (application) {
          if (application.owner instanceof Discord.User) {
            client.config.owner = application.owner.id;
          } else if (application.owner instanceof Discord.Team) {
            client.config.owner =
              application.owner.ownerId || application.owner.id;
          }
        }
        infoLog("No owner override set, bot owner is", client.config.owner);
      }
      client.user?.setPresence({
        status: "online",
        activities: [
          {
            type: "WATCHING",
            name: `always 👀 | ${client.config.prefix}help`,
          },
        ],
      });
    })
  );

  client.on(Discord.Constants.Events.RATE_LIMIT, verboseLog);
  client.on(Discord.Constants.Events.DEBUG, verboseLog);
  client.on(Discord.Constants.Events.WARN, verboseLog);
  client.on(Discord.Constants.Events.ERROR, debugLog);
  client.on(Discord.Constants.Events.SHARD_DISCONNECT, (closeEvent) => {
    verboseLog("[NETWORK] Disconnected from discord API", closeEvent);
  });
  client.on(Discord.Constants.Events.SHARD_RECONNECTING, () => {
    verboseLog("[NETWORK] Attempting to reconnect to discord API");
  });
  client.on(Discord.Constants.Events.SHARD_RESUME, (replayed) => {
    verboseLog(
      `[NETWORK] Resumed connection to discord API (replaying ${replayed} events)`
    );
  });

  if (config.dblKey && config.dblKey.length > 0) {
    startDBLApiHook(client, config.dblKey);
  }
  await client.login(config.key);
  return client;
}
