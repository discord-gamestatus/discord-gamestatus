#!/bin/sh

gamestatus-scheduler &
node --title discord-gamestatus ./bin/discord-gamestatus -- $@
