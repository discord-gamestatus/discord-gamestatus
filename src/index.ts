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

import Discord from "discord.js-light";
import { promises as fs } from "fs";
import { allSettled, errorWrap, isOfBaseType } from "@douile/bot-utilities";

import UpdateCache from "./structs/UpdateCache";
import Command from "./structs/Command";
import Client, { ClientConfig } from "./structs/Client";
import Message from "./structs/Message";
import Update from "./structs/Update";
import { setDebugFlag, debugLog, verboseLog, errorLog, infoLog } from "./debug";
import { getLimits, Limit } from "./limits";

let TICK_GENERATOR: AsyncGenerator<Update[]> | undefined = undefined;
let TICK_LIMITS: Counters | undefined = undefined;
let TICK = 0;
let TICK_SECOND = 0;

const TICK_EVENT = "updateTick";
const MAX_TICK = Math.min(4294967296, Number.MAX_SAFE_INTEGER);

const INVITE_FLAGS = [
  "VIEW_AUDIT_LOG",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "ADD_REACTIONS"
];

const UPDATE_INTERVALS: { [key: string]: NodeJS.Timeout } = {};

const CLIENT_OPTIONS: Discord.ClientOptions = {
  cacheGuilds: true,
  cacheChannels: false,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: false,
  cachePresences: false,
  messageCacheMaxSize: 0,
  disableMentions: "everyone",
  restTimeOffset: 1000,
  presence: {
    status: "online",
    activity: {
      type: "WATCHING",
      name: "always 👀"
    }
  }
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
  limitRules: {}
};

interface Counter {
  guildCount: number;
  channelCount: { [id: string]: number };
  limits: Limit;
}

type Counters = Map<string, Counter>;

async function loadCommands(commands: Map<string, Command>) {
  const files = await fs.readdir(`${__dirname}/commands`);
  async function loadCommand(file: string) {
    const command: Command = require(`./commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
    debugLog(`Loaded command ${command.name}`);
  }
  await Promise.all(files.map(loadCommand));
}

function readJSONOrEmpty(fileName: string) {
  return new Promise(resolve => {
    fs.readFile(fileName, { encoding: "utf-8" })
      .then(content => {
        let data = {};
        try {
          data = JSON.parse(content);
        } catch (e) {
          verboseLog("Error parsing JSON", e);
        }
        resolve(data);
      })
      .catch(() => {
        resolve({});
      });
  });
}

async function loadAdditionalConfigs(config: ClientConfig) {
  config.limitRules = await readJSONOrEmpty(`${__dirname}/../limit-rules.json`) as ClientConfig["limitRules"];
  verboseLog("Limit rules", config.limitRules);
}

function startIntervals(client: Client) {
  stopIntervals(client);

  UPDATE_INTERVALS.tick = client.setInterval(() => {
    client.emit(TICK_EVENT);
  }, client.config.tickTime);
}

function stopIntervals(client: Client) {
  for (let key in UPDATE_INTERVALS) {
    client.clearInterval(UPDATE_INTERVALS[key]);
    delete UPDATE_INTERVALS[key];
  }
}

/*******************************************************************************
 *** Event functions
 *******************************************************************************/

async function onMessage(oMessage: Discord.Message) {
  const message: Message = oMessage as Message;
  if (message.author.bot) return;
  if (!message.content.startsWith(message.client.config.prefix)) return;

  let parts = message.content
    .substr(message.client.config.prefix.length)
    .split(" ");
  if (parts.length === 0) return;
  let command = parts
    .splice(0, 1)[0]
    .trim()
    .toLowerCase();

  const cmd = message.client.commands.get(command);
  if (cmd) {
    debugLog(
      `[Command] ${message.author.username} [${message.author.id}] :: ${command} / ${parts
        .map(v => `"${v}"`)
        .join(", ")}`
    );

    if (!(cmd.check instanceof Function) || cmd.check(message)) {
      try {
        await cmd.call(message, parts);
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
function onTick(client: Client) {
  return async function() {
    if (TICK_GENERATOR === undefined)
      TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
    if (TICK_LIMITS === undefined) TICK_LIMITS = new Map();
    let tick = await TICK_GENERATOR.next();
    if (tick.done) {
      TICK_GENERATOR = client.updateCache.tickIterable(client.config.tickCount);
      tick = await TICK_GENERATOR.next();
      TICK_LIMITS.clear();
    }

    if (TICK >= MAX_TICK) TICK = 0;
    let r = TICK % client.config.tickCount;
    if (r === 0) TICK_SECOND += 1;
    if (TICK_SECOND >= MAX_TICK) TICK_SECOND = 0;

    TICK += 1;

    verboseLog("[TICKER] Starting tick", r, tick.value !== undefined);
    let promises = [];
    if (tick.value) {
      for (let update of tick.value) {
        promises.push(doUpdate(client, update, TICK_SECOND, TICK_LIMITS));
      }
    }
    let res = await allSettled(promises);
    if (res.length > 0)
      verboseLog("[TICKER] Finished tick", r, promises.length, res);
  };
}

async function doUpdate(
  client: Client,
  update: Update[] | Update,
  tick: number,
  counters: Counters
) {
  if (!Array.isArray(update)) update = [update];
  await Promise.all(
    update.map(async u => {
      if (u._deleted) {
        verboseLog(`Skipping updating [${u.ID()}]: already deleted`);
        return;
      }
      if (await u.shouldDelete(client)) {
        await client.updateCache.delete(u);
        await u.deleteMessage(client);
        debugLog(`Deleted obselete update ${u.ID()}`);
      } else {
        if (await checkTickLimits(client, u, counters)) {
          await u.send(client, tick);
        } else {
          await client.updateCache.delete(u);
          await u.deleteMessage(client);
          debugLog(`Deleted update for exceeding limits ${u.ID()}`);
        }
      }
    })
  );
}

async function checkTickLimits(
  client: Client,
  update: Update,
  counters: Counters
): Promise<boolean> {
  let counter: Counter | undefined;
  if (!update.guild || !update.channel) return false;

  if (!counters.has(update.guild)) {
    const guild = (await update.getGuild(client, true)) as Discord.Guild;
    counter = {
      guildCount: 0,
      channelCount: {},
      limits: (await getLimits(client, guild.ownerID)) as Limit
    };
  } else {
    counter = counters.get(update.guild);
  }

  if (!counter) return false;

  counter.guildCount += 1;
  if (update.channel in counter.channelCount) {
    counter.channelCount[update.channel] += 1;
  } else {
    counter.channelCount[update.channel] = 1;
  }

  counters.set(update.guild, counter);
  if (counter.guildCount > (counter.limits.guildLimit || 0)) return false;
  if (counter.channelCount[update.channel] > (counter.limits.channelLimit || 0))
    return false;
  return true;
}

// TODO: Add raw Config interface
export default async function start(config: any) {
  setDebugFlag(
    config.error,
    config.warn,
    config.info,
    config.debug,
    config.verbose
  );
  /* Override owner, prefix, tickCount, tickTime */
  let clientConfig = DEFAULT_CONFIG;
  let key: keyof ClientConfig;
  for (key in clientConfig) {
    if (key in config) (clientConfig as any)[key] = config[key];
  }

  let updateCache;
  if (config.database) {
    updateCache = new UpdateCache({
      database: config.database,
      filename: `${__dirname}/../_save.json`
    });
  } else {
    updateCache = new UpdateCache({ filename: `${__dirname}/../_save.json` });
  }

  verboseLog("CONFIG", clientConfig);

  debugLog("DEBUG LOGS ENABLED");
  verboseLog("VERBOSE LOGS ENABLED");
  let commands: Map<string, Command> = new Map();
  await loadCommands(commands);
  await loadAdditionalConfigs(clientConfig);
  await updateCache.load();

  const client = new Client(
    updateCache,
    commands,
    clientConfig,
    CLIENT_OPTIONS
  );

  client.on(Discord.Constants.Events.MESSAGE_CREATE, errorWrap<[messsage: Discord.Message], any, any, void>(onMessage));
  client.on(
    Discord.Constants.Events.CLIENT_READY,
    errorWrap(async function() {
      infoLog(`Logged in ${client.user?.username} [${client.user?.id}]...`);
      let invite = await client.generateInvite({
        permissions: <Discord.PermissionString[]>INVITE_FLAGS
      });
      infoLog(`Invite link ${invite}`);
      startIntervals(client);
      if (client.config.owner === undefined) {
        const application = await client.fetchApplication();
        if (application.owner instanceof Discord.User) {
          client.config.owner = application.owner.id;
        } else if (application.owner instanceof Discord.Team) {
          client.config.owner =
            application.owner.ownerID || application.owner.id;
        }
        infoLog("No owner override set, bot owner is", client.config.owner);
      }
      await client.user?.setPresence({
        status: "online",
        activity: {
          type: "WATCHING",
          name: `always 👀 | ${client.config.prefix}help`
        }
      });
    })
  );

  client.on(TICK_EVENT, errorWrap(onTick(client)));

  client.on(Discord.Constants.Events.RATE_LIMIT, verboseLog);
  client.on(Discord.Constants.Events.DEBUG, verboseLog);
  client.on(Discord.Constants.Events.WARN, verboseLog);
  client.on(Discord.Constants.Events.ERROR, debugLog);
  client.on(Discord.Constants.Events.DISCONNECT, closeEvent => {
    stopIntervals(client);
    verboseLog("[NETWORK] Disconnected from discord API", closeEvent);
  });
  client.on(Discord.Constants.Events.RECONNECTING, () => {
    verboseLog("[NETWORK] Attempting to reconnect to discord API");
  });
  client.on(Discord.Constants.Events.RESUMED, replayed => {
    startIntervals(client);
    verboseLog(
      `[NETWORK] Resumed connection to discord API (replaying ${replayed} events)`
    );
  });

  if (isOfBaseType(config.dblKey, String) && config.dblKey.length > 0) {
    require("./dblapi.js")(client, config.dblKey);
  }
  await client.login(config.key);
  return client;
}