import net from "node:net";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v10";

import { query } from "./query.js";
import { generateEmbed } from "./embed.js";
import {
  APIError,
  APIMessageResponse,
  SchedulerResponse,
  Update,
} from "./types.js";

import {
  isAPIApplication,
  isParseUpdate,
  isMessageAPI,
  validateAPIApplication,
  validateMessageAPI,
} from "./typia-generated/is.js";

async function start(token: string, scheduler_uri: string) {
  const restClient = new REST({ version: "10" }).setToken(token);

  const application = await restClient.get(Routes.currentApplication());
  if (!isAPIApplication(application)) {
    console.log(validateAPIApplication(application));
    throw new Error(`API token not valid: ${JSON.stringify(application)}`);
  }
  console.log(`Logged in as ${application.name}`);

  console.log(`Connecting to scheduler (${scheduler_uri})...`);
  const socket = net.createConnection(
    {
      port: 1337, // TODO: Don't hard-code port
      host: scheduler_uri,
    },
    () => {
      console.log("Connected to scheduler");
    }
  );
  socket.on("data", (data) => {
    const json = data.toString("utf8");
    const update = isParseUpdate(json);
    if (!update) return;
    handleUpdate(restClient, update).then((result) => {
      let toSend: SchedulerResponse;
      if ("code" in result) {
        toSend = {
          state: "error",
          code: result.code,
          message: result.message,
        };
      } else {
        toSend = {
          state: "sent",
          message_id: result.id,
          status_id: update.id,
        };
      }
      // TODO: Only print in debug mode
      console.log("Scheduler-result", toSend);
      socket.write(JSON.stringify(toSend));
    }, console.error);
  });
  const onClose = new Promise((resolve) => socket.on("close", resolve));
  socket.on("error", (e) => console.error("Connection error", e));

  await onClose;
  console.log("Finished");
}

async function handleUpdate(
  rest: REST,
  update: Update
): Promise<APIError | APIMessageResponse> {
  console.log("Handle", update);
  const result = await query(update.type, update.ip);

  const embed = await generateEmbed(update, result, 0);
  const body = { embeds: [embed.toJSON()] };

  // Send message
  let messageResult;
  if (update.message_id) {
    messageResult = await rest.patch(
      Routes.channelMessage(update.channel_id, update.message_id),
      { body }
    );
  } else {
    messageResult = await rest.post(Routes.channelMessages(update.channel_id), {
      body,
    });
  }

  if (!isMessageAPI(messageResult)) {
    console.log(validateMessageAPI(messageResult));
    throw new Error("Bad response");
  }

  const r = messageResult as APIError | APIMessageResponse;

  if ("code" in r) {
    console.warn("Error with message", r.code);
  }

  return r;
}

// TODO: Check if main
const TOKEN = process.env.DISCORD_API_KEY || "";
const SCHEDULER_URI = process.env.GS_SCHEDULER_URI || "";
await start(TOKEN, SCHEDULER_URI);
