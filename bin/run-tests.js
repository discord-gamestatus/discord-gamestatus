#!/usr/bin/env node

const { spawnSync } = require("child_process");

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

checkOutput(spawnSync("npm", ["run", "test:lint"], { stdio }));
checkOutput(spawnSync("npm", ["run", "test:format"], { stdio }));

process.exit(rCode);
