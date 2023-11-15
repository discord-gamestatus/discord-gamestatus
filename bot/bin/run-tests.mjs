#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run=npm,cargo

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const stdio = ["inherit", "inherit", "inherit"];

let rCode = 0;

function checkOutput({ status, error }) {
  if (status !== null && status !== 0) {
    rCode = status;
  } else if (error) {
    console.error(error);
    rCode = 1;
  }
}

let testBot = false;
let testDispatcher = false;
let testSql = false;
let testScheduler = false;
if (process.argv.length < 3) {
  testBot = true;
  testDispatcher = true;
  testSql = true;
  testScheduler = true;
} else {
  for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
      case "--bot":
        testBot = true;
        break;
      case "--scheduler":
        testScheduler = true;
        break;
      case "--sql":
        testSql = true;
        break;
      case "--dispatcher":
        testDispatcher = true;
        break;
      default:
        console.log("Unknown argument", process.argv[i]);
        break;
    }
  }
}

const BASE_DIR = dirname(fileURLToPath(import.meta.url));
const BOT_DIR = join(BASE_DIR, "../");
const DISPATCHER_DIR = join(BASE_DIR, "../../dispatcher/");
const SCHEDULER_DIR = join(BASE_DIR, "../../scheduler/");

if (testBot) {
  const env = { stdio, cwd: BOT_DIR };
  checkOutput(spawnSync("npm", ["run", "test:lint"], env));
  checkOutput(spawnSync("npm", ["run", "test:lint:bin"], env));
  checkOutput(spawnSync("npm", ["run", "test:format"], env));
}
if (testDispatcher) {
  const env = { stdio, cwd: DISPATCHER_DIR };
  checkOutput(spawnSync("npm", ["run", "test:lint"], env));
  checkOutput(spawnSync("npm", ["run", "test:format"], env));
}
if (testSql) {
  checkOutput(
    spawnSync("npm", ["run", "test:lint:sql"], { stdio, cwd: BOT_DIR })
  );
}
if (testScheduler) {
  const env = { stdio, cwd: SCHEDULER_DIR };
  checkOutput(spawnSync("cargo", ["check", "--all-features"], env));
  checkOutput(spawnSync("cargo", ["fmt", "--check"], env));
  checkOutput(spawnSync("cargo", ["clippy"], env));
  checkOutput(spawnSync("cargo", ["test"], env));
}

process.exit(rCode);
