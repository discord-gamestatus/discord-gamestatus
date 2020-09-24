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
git pull --ff # This will overwrite local changes, If you wish to save them use git stash
git checkout latest # Checkout latest stable version
git log --name-status HEAD^..HEAD # Check latest commit
npm install --no-optional # Update dependencies (remove --no-optional for optional dependencies, they are faster but need to be compiled)
```

## Commands
_At the moment there is no help command_

| Command | Usage | Permissions | Comments |
| ------- | ----- | ----------- | -------- |
| help | `!help [command]` | None | List commands / Get help with a specific command
| gamelist | `!gamelist [game]` | ADMINISTRATOR | View/Search the list of games available
| notify | `!notify [user]` | None | (Only in channel with a single status message) Get PM notifications when provided user connect/disconnects. Omit user to get notifications when the server changes map or goes offline/online.
| status | `!status {game} {ip}` | ADMINISTRATOR | Add a status message to current channel
| statusclear | `!statusclear` | ADMINISTRATOR | Clear all status messages from current channel
| statusmod | `!statusmod [id] [property] [value]` | ADMINISTRATOR | Modify status messages in the current channel
| botinfo | `!botinfo` | None | Print information about current versions, uptime and ping of the bot
| dumpticks | `!dumpticks` | Bot owner | Dump a list of what updates occur on what ticks

## Configuring
You can use an environment file set environment variables, this is the recommended way to set API keys
Example env file `/etc/discord-gamestatus/env` (remember to set the file permissions of this file so other users cannot read it: `chmod 600 /etc/discord-gamestatus/env`, can be owned by root as long as systemd runs as root `chown root:root /etc/discord-gamestuats/env`)
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
| `-v`, `--verboose` | Enable verbose logging
| `--dev` | Enable dev mode (auto restart bot when files are changed)
| `-p [prefix]`, `--prefix [prefix]` | Change the bots prefix
| `--key [key]` | Set the discord bot API key (overrides the environment variable)
| `--topgg-key [key]` | Set the discord bot list key (https://top.gg/)
| `--owner [snowflake]` | Set the bot owner
| `--tick-count [count]` | Set the number of ticks
| `--tick-time [time]` | Set the time between ticks in ms
| `--admin [flag]` | Set the permission needed to be considered an admin by the bot ([see](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS))


### Running as service on debian (or other systemd linux)

In order to run on debian I find it easy to run as a service. Steps to setup are as follows.

1. Create a start script to configure the bot
```bash
#!/bin/sh
node --max-old-space-size=300 --title "discord-gamestatus" ./index.js --prefix "_" --owner "293482190031945739"
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
WorkingDirectory=CODE_LOCATION
EnvironmentFile=/etc/discord-gamestatus/env
ExecStart=/bin/sh SCRIPT_LOCATION

[Install]
WantedBy=multi-user.target
```
5. You can now start the bot with `sudo systemctl start discord-gamestatus`, to enable the bot on restart use `sudo systemctl enable discord-gamestatus`. To check the status use `systemctl status discord-gamestatus` or for a live log use `journalctl -f -u discord-gamestatus`.
