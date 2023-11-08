# 2.X.Y - YYYY/MM/DD

## Changes:

# 2.3.0 - 2023/11/08

## Changes:

- Added SQL linting/formatting
- Updated dependencies (including gamedig)
- Added CONTRIBUTING.md
- Added CHANGELOG.md
- Add local IP range blocklist (and CLI option to disable `--dont-block-local-addresses`)
- Use dotenv when starting to source environment variables
- Various SQL fixes
- Improve docker build and compose
- Fixed commands timing out while accessing database by deferring the response
- Prefixed imports from nodes standard library with `node:`
- Added issue templates

## Breaking changes:

- Add a scheduler that is needed to tell the bot when to update status messages
- `Renamed bin/discord-gamestatus` to `bin/discord-gamestatus.js`

# Older

For older changelogs see the [github releases](https://github.com/discord-gamestatus/discord-gamestatus/releases)