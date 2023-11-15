import typia from "typia";
import {
  RESTPatchAPIChannelMessageResult,
  RESTPostAPIChannelMessageResult,
} from "discord-api-types/v10";

import {
  APIApplication,
  APIError,
  APIMessageResponse,
  Update,
} from "../types.js";

export const isAPIApplication = typia.createIs<APIApplication>();
export const isParseUpdate = typia.createIsParse<Update>();
export const isMessageAPI = typia.createIs<APIError | APIMessageResponse>();

export const validateAPIApplication = typia.createValidate<APIApplication>();
export const validateRESTPatchAPIChannelMessageResult =
  typia.createValidate<RESTPatchAPIChannelMessageResult>();
export const validateRESTPostAPIChannelMessageResult =
  typia.createValidate<RESTPostAPIChannelMessageResult>();
export const validateMessageAPI = typia.createValidate<
  APIError | APIMessageResponse
>();
