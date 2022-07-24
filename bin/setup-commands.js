#!/usr/bin/env node

"use strict";

/*
discord-gamestatus: Game server monitoring via discord API
Copyright (C) 2022 Douile

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

const fs = require("fs/promises");
const path = require("path");
const { ApplicationCommandManager } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

(async function () {
  const rest = new REST({ version: 10 }).setToken(process.env.DISCORD_API_KEY);
  const application = await rest.get(Routes.oauth2CurrentApplication());

  const DIR = path.join(__dirname, "../dist/commands");
  const commands = (await fs.readdir(DIR))
    .map((file) => {
      const command = require(path.join(DIR, file));
      if (command.disableSlash) return undefined;
      const newLineIndex = command.help.indexOf("\n");
      return ApplicationCommandManager.transformCommand({
        name: command.name,
        description: command.help.substring(
          0,
          Math.min(newLineIndex > 1 ? newLineIndex : command.help.length, 100)
        ),
        options: command.options,
        defaultPermission: true,
        type: "CHAT_INPUT",
      });
    })
    .filter((command) => command !== undefined);
  console.log(commands);

  await rest.put(Routes.applicationCommands(application.id), {
    body: commands,
  });
})().then(null, console.error);
