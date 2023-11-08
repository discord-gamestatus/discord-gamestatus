#!/usr/bin/env node
'use strict';

const fs = require('fs').promises;
const readline = require('readline');
const { Client } = require('pg');

function overwriteLine(text) {
  return new Promise((resolve, reject) => {
    readline.cursorTo(process.stdout, 0, function(drain) {
      process.stdout.write(text, 'utf8', resolve);
    });
  })
}

const file = process.argv[2];

async function main() {
  console.log(`Migrating from ${file}`);
  const text = await fs.readFile(file, { encoding: 'utf-8' });
  const data = JSON.parse(text);

  console.log('Connecting to database');
  const client = new Client({ database: 'discord_gamestatus' });
  await client.connect();

  const keys = Object.keys(data);
  let saved = 0;
  console.log(`0/${keys.length} channels saved`);
  for (let channel of keys) {
    for (let update of data[channel]) {
      await client.query('INSERT INTO statuses (guild_id, channel_id, message_id, type, ip, name, state, dots, title, offline_title, description, offline_description, color, offline_color, image, offline_image, columns, max_edits, connect_update, disconnect_update) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::jsonb, $8::text[], $9::text, $10::text, $11::text, $12::text, $13::int, $14::int, $15::text, $16::text, $17::int, $18::int, $19::boolean, $20::boolean)', [
        update.guild,
        update.channel,
        update.message,
        update.type,
        update.ip,
        update.name,
        JSON.stringify(update.state),
        update.options?.dots,
        update.options?.title,
        update.options?.offlineTitle,
        update.options?.description,
        update.options?.offlineDescription,
        update.options?.color,
        update.options?.offlineColor,
        update.options?.image,
        update.options?.offlineImage,
        update.options?.columns,
        update.options?.maxEdits,
        update.options?.connectUpdate,
        update.options?.disconnectUpdate,
      ]);
    }
    await overwriteLine(`${++saved}/${keys.length} channels saved`);
  }
  console.log('\nDone');
  await client.end();
}

main().then(null, console.error);
