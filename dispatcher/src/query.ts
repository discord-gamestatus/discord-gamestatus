import { lookup } from "node:dns/promises";

import GameDig from "gamedig";
import GameResolver from "gamedig/lib/GameResolver.js";

import { markdownEscape } from "@douile/bot-utilities";

export type Game = {
  keys: string[];
  pretty: string;
  options: {
    protocol: string;
    port?: number;
    port_query?: number;
    port_query_offset?: number;
  };
  extra?: {
    doc_notes?: string;
  };
  protocol?: string;
};

let resolver: GameResolver;

function getResolver() {
  if (!resolver) resolver = new GameResolver();
  return resolver;
}

function shouldBlock(value: Address): boolean {
  // FIXME: Unstub
  return false; // stub
}

export interface Address {
  host: string;
  ip: string;
  family: "ipv4" | "ipv6";
  port?: number;
}

/**
 * Parse an address string to host and port parts as well as resolving DNS addresses
 */
export async function resolveAddress(address: string): Promise<Address> {
  const url = new URL("tcp://" + address);
  const host =
    url.hostname.startsWith("[") && url.hostname.endsWith("]")
      ? url.hostname.substring(1, url.hostname.length - 1)
      : url.hostname;
  const resolved = await lookup(host);
  const port = parseInt(url.port, 10);
  return {
    host,
    ip: resolved.address,
    family: resolved.family === 6 ? "ipv6" : "ipv4",
    port: isNaN(port) ? undefined : port,
  };
}

export interface State extends GameDig.QueryResult {
  offline: boolean;
  numplayers: number;
  realPlayers: GameDig.Player[] | null;
  validPlayers: number;
  players: GameDig.Player[];
  gameHost: string;
  raw?: object;
}

/**
 * Create a connect string that is a link
 */
function parseConnect(connect: string, protocol: string) {
  switch (protocol) {
    case "valve":
      return `<steam://connect/${connect}>`;
    case "fivem":
      return `<fivem://connect/${connect}>`;
    default:
      return connect;
  }
}

/**
 * Normalise map name
 */
function parseMap(map: string, protocol: string) {
  switch (protocol) {
    case "minecraft":
      return "Minecraft world";
    default:
      return map;
  }
}

/**
 * Make a game query
 */
export async function query(
  queryType: GameDig.Type,
  ip: string,
  blockLocalAddresses = false
): Promise<State> {
  const game = getResolver().lookup(queryType);
  const protocol = game.protocol;
  const isDiscord = protocol === "discord";
  let state: State;

  const address = await resolveAddress(ip);
  if (blockLocalAddresses && shouldBlock(address)) {
    throw new Error(
      `Resolved address (${address.host} -> ${address.ip}) is blocked`
    );
  }

  try {
    const rawState = await GameDig.query({
      type: queryType,
      host: isDiscord ? "127.0.0.1" : address.ip,
      port: address.port,
      //debug: true,
    });
    const realPlayers = rawState.players
      .filter((v) => typeof v.name === "string")
      .map((v) => {
        v.name = markdownEscape(v.name?.trim() || "");
        return v;
      })
      .filter((v) => v.name?.length || 0 > 0);
    state = {
      offline: false,
      numplayers:
        (rawState.raw as { [key: string]: number })["numplayers"] ||
        rawState.players.length,
      realPlayers,
      validPlayers: realPlayers.length,
      gameHost: address.host,
      ...rawState,
    };
    state.players = Array.from(state.players || []);
    state.connect = parseConnect(state.connect, protocol);
    state.map = parseMap(state.map, protocol);
  } catch (e) {
    console.log(
      "[query] Error getting game status",
      e instanceof Error ? e.message : e
    );
    console.log(e);
    state = {
      name: "OFFLINE",
      map: "OFFLINE",
      password: false,
      numplayers: 0,
      maxplayers: 0,
      validPlayers: 0,
      bots: [],
      ping: 0,
      players: [],
      realPlayers: null,
      offline: true,
      connect: ip,
      gameHost: address.host,
    };
  }

  return state;
}
