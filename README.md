# discord-gamestatus

[Invite link](https://discordapp.com/oauth2/authorize?client_id=659050996730822665&permissions=126144&scope=bot)

## Installing
[Git](https://git-scm.org), [node](https://nodejs.org) and [npm](https://nodejs.org) are required

_In future I plan to add install script and update command to make this easier_

```bash
# Navigate to the directory where you wish to install the bot
git clone https://github.com/Douile/discord-gamestatus.git
cd discord-gamestatus
git checkout latest # Checkout latest stable version
npm install --no-optional # Install dependencies
# If you like you can install optional dependencies but they require node-gyp
# For more info see https://discord.js.org/#/docs/main/12.2.0/general/welcome
```

### Updating
```bash
# Navigate to the installed directory
cd discord-gamestatus
# Reset may be needed if you made changes
# git reset --hard latest
git checkout master
git tag -d latest
git stash
git pull
git checkout latest # Checkout latest stable version
git stash pop
git log --name-status HEAD^..HEAD # Check latest commit
npm install --no-optional # Update dependencies (remove --no-optional for optional dependencies, they are faster but need to be compiled)
```

## Commands
_At the moment there is no help command_

| Command | Usage | Permissions | Comments |
| ------- | ----- | ----------- | -------- |
| help | `!help [command]` | None | List commands / Get help with a specific command
| gamelist | `!gamelist [game]` | ADMINISTRATOR | View/Search the list of games available
| status | `!status {game} {ip}` | ADMINISTRATOR | Add a status message to current channel
| statusclear | `!statusclear` | ADMINISTRATOR | Clear all status messages from current channel
| statusmod | `!statusmod [id] [property] [value]` | ADMINISTRATOR | Modify status messages in the current channel
| statusrefresh | `!statusrefresh` | ADMINISTRATOR | Make all statuses in the specified channel send a new message
| statusremove | `!statusremove [#channel] [#message]` (can just use `!statusremove` when reacting to a status | ADMINISTRATOR | Remove a status message
| limits | `!limits` | None | View your guilds status limits
| botinfo | `!botinfo` | None | Print information about current versions, uptime and ping of the bot

## Configuring
You can use an environment file set environment variables, this is the recommended way to set API keys
Example env file `/etc/discord-gamestatus/env` (remember to set the file permissions of this file so other users cannot read it: `chmod 600 /etc/discord-gamestatus/env`, can be owned by root as long as systemd runs as root `chown root:root /etc/discord-gamestatus/env`)
```bash
DISCORD_API_KEY=NjU5.Examplekey
TOPGG_API_KEY=ApiKeyHere
```


### ARGV options
You can configure the bot using argv options for example to change the prefix to `$` and enable debug logging you would use:
```bash
node . -d --prefix "$"
```

| Arguments | Usage
| :-------- | -----
| `-d`, `--debug` | Enable debug logging
| `-v`, `--verbose` | Enable verbose logging
| `--dev` | Enable dev mode (auto restart bot when files are changed)
| `-p [prefix]`, `--prefix [prefix]` | Change the bots prefix
| `--key [key]` | Set the discord bot API key (overrides the environment variable)
| `--dbl-key [key]` | Set the discord bot list key (https://top.gg/)
| `--owner [snowflake]` | Set the bot owner
| `--tick-count [count]` | Set the number of ticks
| `--tick-time [time]` | Set the time between ticks in ms
| `--channel-limit [limit]` | The max amount of statuses per channel (0 / not set = infinite)
| `--guild-limit [limit]` | The max amount of statuses per guild (0 / not set = infinite)
| `--allow-duplicate-updates` | Allow guilds to have multiple statuses for the same IP
| `--admin [flag]` | Set the permission needed to be considered an admin by the bot ([see](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS))
| `--support [link]` | Set the link to bot support server (shown in botinfo)


### Running as service on debian (or other systemd linux)

In order to run on debian I find it easy to run as a service. Steps to setup are as follows.

1. Create a start script to configure the bot
```bash
#!/bin/sh
node --max-old-space-size=300 --title "discord-gamestatus" ./bin/discord-gamestatus --prefix "_" --owner "293482190031945739"
```
2. Allow yourself to run the script `chmod +x start.sh` (or other script filename)
3. Create an environment file for API keys [See here](#Configuring)
4. (you will need root for this) Create a service in `/etc/systemd/service/discord-gamestatus.service` (Make sure to replace SCRIPT_LOCATION, USER and CODE_LOCATION with the actual locations)
```
[Unit]
Description=Discord gamestatus bot
After=network.target
StartLimitBurst=5
StartLimitIntervalSec=5

[Service]
Type=simple
Restart=always
RestartSec=5
User=USER
Group=GROUP
WorkingDirectory=CODE_LOCATION
EnvironmentFile=/etc/discord-gamestatus/env
ExecStart=/bin/sh SCRIPT_LOCATION

[Install]
WantedBy=multi-user.target
```
5. You can now start the bot with `sudo systemctl start discord-gamestatus`, to enable the bot on restart use `sudo systemctl enable discord-gamestatus`. To check the status use `systemctl status discord-gamestatus` or for a live log use `journalctl -f -u discord-gamestatus`.
