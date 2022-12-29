#!/usr/bin/env node

const { spawnSync } = require("child_process");
const { join } = require("path");

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
let testSql = false;
let testScheduler = false;
if (process.argv.length < 3) {
  testBot = true;
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
      default:
        console.log("Unknown argument", process.argv[i]);
        break;
    }
  }
}

if (testBot) {
  checkOutput(spawnSync("npm", ["run", "test:lint"], { stdio }));
  checkOutput(spawnSync("npm", ["run", "test:lint:bin"], { stdio }));
  checkOutput(spawnSync("npm", ["run", "test:format"], { stdio }));
}
if (testSql) {
  checkOutput(spawnSync("npm", ["run", "test:lint:sql"], { stdio }));
}
if (testScheduler) {
  let cwd = join(process.cwd(), "scheduler");
  checkOutput(spawnSync("cargo", ["check", "--all-features"], { stdio, cwd }));
  checkOutput(spawnSync("cargo", ["fmt", "--check"], { stdio, cwd }));
  checkOutput(spawnSync("cargo", ["test"], { stdio, cwd }));
}

process.exit(rCode);
