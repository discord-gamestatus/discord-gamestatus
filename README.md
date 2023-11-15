# discord-gamestatus

## What is this branch

This branch is moving the dispatcher component (part that queries game server state, generates a status message, and
sends that message to discord), into its own seperate program from the main bot.

The reasons for doing so are as follows:
- Simplify code-base
- Allow for rewriting the bot
  - Dispatching requires `node-gamedig`, a javascript library, so by seperating this out we can rewrite the main bot part
    in any language we like
- Allow for running `N` dispatchers
  - More easily spread the load of querying from multiple servers without needing a discord websocket connected

## TODO:

### Required

#### Scheduler
- [ ] Store metadata on status (or in seperate table)
  - last updated time
  - updated by (dispatcher ID)
- [ ] Store client errors
  - error code
  - error message
  - dispatcher ID
  - (server offline is not an error)
- [ ] Use TLS for postgres

#### Dispatcher
- [ ] Send ID to scheduler
  - Login packet?
    - Scheduler can have allowlist for IP - ID + secret
- [ ] Better transport medium
  - encrypted
  - more efficient that JSON: protobuf, CBOR
- [ ] Implement local IP blocklist (in runtime indepedent way)
- [ ] Get working on different runtimes
  - [ ] Deno (should work now, missing net:blocklist)
  - [ ] Bun (requires - https://github.com/oven-sh/bun/issues/1630)
- [ ] Make a common query library to be used by both the bot and dispatcher

#### Docs
- [ ] Update docs

### Nice to have

#### Scheduler
- [ ] Don't use arcs for objects that live forever
- [ ] Pipeline database
- [ ] Make code less of a mess

#### Bot
- [ ] Finish rust rewrite

#### Docs
- [ ] Architecture diagram

---

An open-source discord bot that actively monitors your game server and updates a discord message with the
current status.

- [Invite link](https://discordapp.com/oauth2/authorize?client_id=659050996730822665&permissions=126144&scope=bot)
- [Command documentation](https://gamestatus.douile.com/docs/user)
- [Self-hosting documentation (WIP)](https://gamestatus.douile.com/docs/admin)
- [Terms of usage (for public bot)](https://gamestatus.douile.com/TERMS)
- [Privacy policy (for public bot)](https://gamestatus.douile.com/PRIVACY)

## Changelog
See [CHANGELOG](./CHANGELOG.md)

## Contributing
If you would like to request a new feature, report a bug, or even fix or improve our code we welcome your contribution.
Open an issue to make a request, or a PR to submit your code for review.

Before contributing please read [CONTRIBUTING](./CONTRIBUTING.md)

## LICENSE
[Licensed under GPL-3.0](./LICENSE)
