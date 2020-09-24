#!/usr/bin/env node

const { setupAndStart } = require('discord-gamestatus');

setupAndStart(process.env, process.argv);
