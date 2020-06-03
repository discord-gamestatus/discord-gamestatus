# discord-gamestatus

[Invite link](https://discordapp.com/oauth2/authorize?client_id=659050996730822665&permissions=126144&scope=bot)

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
You will need to set the env option `DISCORD_API_KEY` to your discord bot token for the bot to run

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
| `--dbl-key [key]` | Set the discord bot list key (https://top.gg/)
| `--owner [snowflake]` | Set the bot owner
| `--tick-count [count]` | Set the number of ticks
| `--tick-time [time]` | Set the time between ticks in ms
| `--admin [flag]` | Set the permission needed to be considered an admin by the bot ([see](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS))


### Running as service on debian (or other systemd linux)

In order to run on debian I find it easy to run as a service. Steps to setup are as follows.

1. Create a start script that contains this (Make sure to put your discord API key in)
```bash
#!/bin/sh
export DISCORD_API_KEY=""
node ./index.js
```
2. Allow yourself to run the script `chmod +x start.sh` (or other script filename)
3. (you will need root for this) Create a service in `/etc/systemd/service/discord-gamestatus.service` (Make sure to replace SCRIPT_LOCATION, USER and CODE_LOCATION with the actual locations)
```
[Unit]
Description=Discord GameStatus Bot
After=network.target
StartLimitBurst=5
StartLimitIntervalSec=5
[Service]
Type=simple
Restart=always
RestartSec=2
User=USER
WorkingDirectory=CODE_LOCATION
ExecStart=SCRIPT_LOCATION
[Install]
WantedBy=multi-user.target
```
4. You can now start the bot with `sudo systemctl start discord-gamestatus`, to enable the bot on restart use `sudo systemctl enable discord-gamestatus`. To check the status use `systemctl status discord-gamestatus` or for a live log use `journalctl -f -u discord-gamestatus`.
