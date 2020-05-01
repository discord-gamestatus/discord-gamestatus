#!/usr/bin/env node

const { setupAndStart } = require('discord-gamestatus');

setupAndStart(process.env.DISCORD_API_KEY, process.argv);
