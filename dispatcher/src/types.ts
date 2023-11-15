import Gamedig from "gamedig";

export interface APIApplication {
  name: string;
}

export interface Update {
  id: number;
  guild_id: string | null;
  channel_id: string;
  message_id: string | null;
  ip: string;
  type: Gamedig.Type;
  title: string | null;
  offline_title: string | null;
  description: string | null;
  offline_description: string | null;
  color: number | null;
  offline_color: number | null;
  image: string | null;
  offline_image: string | null;
  dots: string[] | null;
  columns: number | null;
}

/**
 * A basic version of discord API errors that can be easily validated
 * https://discord.com/developers/docs/reference#error-messages-array-error
 */
export interface APIError {
  code: number;
  message: string;
}

/**
 * A basic version of discord API message response
 * https://discord.com/developers/docs/resources/channel#message-object
 */
export interface APIMessageResponse {
  id: string;
  channel_id: string;
  content: string;
  author: { id: string };
  timestamp: string;
}

export type SchedulerResponse =
  | SchedulerResponseError
  | SchedulerResponseSent
  | SchedulerResponseEdited;

export interface SchedulerResponseError {
  state: "error";
  code: number;
  message: string;
}

export interface SchedulerResponseSent {
  state: "sent";
  status_id: number;
  message_id: string;
}

export interface SchedulerResponseEdited {
  state: "edited";
  status_id: number;
  timestamp: string;
}
