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

import { BlockList } from "node:net";
import { networkInterfaces } from "node:os";
import { lookup } from "node:dns/promises";

import GameDig from "gamedig";
import GameResolver from "gamedig/lib/GameResolver.js";

import { markdownEscape } from "@douile/bot-utilities";

import Client from "./structs/Client";
import { isVerbose, verboseLog } from "./debug";

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

interface Address {
  host: string;
  ip: string;
  family: "ipv4" | "ipv6";
  port?: number;
}
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
let blocklist: BlockList | null = null;
export function getLocalBlocklist(): BlockList {
  if (blocklist !== null) return blocklist;
  blocklist = new BlockList();

  // https://en.wikipedia.org/wiki/Reserved_IP_addresses
  blocklist.addSubnet("0.0.0.0", 8, "ipv4");
  blocklist.addSubnet("10.0.0.0", 8, "ipv4");
  blocklist.addSubnet("100.64.0.0", 10, "ipv4");
  blocklist.addSubnet("127.0.0.0", 8, "ipv4");
  blocklist.addSubnet("169.254.0.0", 16, "ipv4");
  blocklist.addSubnet("172.16.0.0", 12, "ipv4");
  blocklist.addSubnet("192.0.0.0", 24, "ipv4");
  blocklist.addSubnet("192.88.99.0", 24, "ipv4");
  blocklist.addSubnet("192.168.0.0", 16, "ipv4");
  blocklist.addSubnet("198.18.0.0", 15, "ipv4");
  blocklist.addSubnet("224.0.0.0", 4, "ipv4");
  blocklist.addSubnet("233.252.0.0", 24, "ipv4");
  blocklist.addSubnet("240.0.0.0", 4, "ipv4");
  blocklist.addAddress("255.255.255.255", "ipv4");

  blocklist.addAddress("::", "ipv6");
  blocklist.addAddress("::1", "ipv6");
  //blocklist.addSubnet("64:ff9b:1::", 48, "ipv6");
  blocklist.addSubnet("fc00::", 7, "ipv6");
  blocklist.addSubnet("ff00::", 8, "ipv6");

  // Any other local interfaces
  const ifaces = networkInterfaces();
  if (!ifaces) throw new Error("Could not find network interfaces");
  for (const iface in ifaces) {
    for (const range of ifaces[iface] || []) {
      if (range.cidr) {
        const [addr, prefix] = range.cidr.split("/");
        blocklist.addSubnet(
          addr,
          parseInt(prefix),
          range.family as "ipv4" | "ipv6"
        );
      }
    }
  }

  return blocklist;
}
export function shouldBlock(address: Address): boolean {
  return getLocalBlocklist().check(address.ip, address.family);
}

const parseConnect = function (connect: string, protocol: string) {
  switch (protocol) {
    case "valve":
      return `<steam://connect/${connect}>`;
    case "fivem":
      return `<fivem://connect/${connect}>`;
    default:
      return connect;
  }
};

const parseMap = function (map: string, protocol: string) {
  switch (protocol) {
    case "minecraft":
      return "Minecraft world";
    default:
      return map;
  }
};

export interface State extends GameDig.QueryResult {
  offline: boolean;
  numplayers: number;
  realPlayers: GameDig.Player[] | null;
  validPlayers: number;
  players: GameDig.Player[];
  gameHost: string;
  raw?: object;
}

export class AddressBlockedError extends Error {}

export async function query(
  this: Client,
  queryType: GameDig.Type,
  ip: string
): Promise<State> {
  const game = getResolver().lookup(queryType);
  const protocol = game.protocol;
  const isDiscord = protocol === "discord";
  let state: State;

  const address = await resolveAddress(ip);
  if (this.config.blockLocalAddresses && shouldBlock(address)) {
    throw new AddressBlockedError(
      `Resolved address (${address.host} -> ${address.ip}) is blocked`
    );
  }

  try {
    const queryConfig: GameDig.QueryOptions & { address: string } = {
      type: queryType,
      host: isDiscord ? "" : address.host,
      address: address.ip,
      ipFamily: address.family === "ipv6" ? 6 : 4,
      port: address.port,
      debug: isVerbose(),
    };
    if (this.config.queryTimeout) {
      queryConfig.socketTimeout = this.config.queryTimeout;
      queryConfig.attemptTimeout = this.config.queryTimeout;
    }

    const rawState = await GameDig.query(queryConfig);
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
    verboseLog(
      "[query] Error getting game status",
      e instanceof Error ? e.message : e
    );
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

export function gameList(): Game[] {
  const resolver = getResolver();
  return resolver.games;
}

export function isValidGame(game: string): boolean {
  const resolver = getResolver();
  return resolver.gamesByKey.has(game as GameDig.Type);
}
