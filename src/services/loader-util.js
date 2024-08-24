// const { Collection } = require('discord.js');
import { Collection } from 'discord.js';

// const fs = require('fs');
import fs from 'fs';

// const path = require('path');
import path from 'path';
import * as url from 'url';
import { pathToFileURL } from 'url';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands() {
  const commands = new Collection();
  const dirname = url.fileURLToPath(new URL(import.meta.url));
  const foldersPath = path.join(__dirname, '../commands');

  const commandFolders = fs.readdirSync(foldersPath);
  

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {

      const filePath = path.join(commandsPath, file);
      const command =  await import (filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }

  return commands;
}

export async function loadClientEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events/client');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  const fileSomething = new URL ('/C:/Users/linus/OneDrive/Dokument/projekts/SunBotJs/src/events/client/interaction-create.js', import.meta.url);

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileUrl = pathToFileURL(filePath);
    const event = await import(fileSomething);
    events.push(event);
  }

  return events;
}

export async function loadVoiceEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events/voice-connection');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    events.push(event);
  }

  return events;
}

export async function loadAudioEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events/audio-player');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    events.push(event);
  }

  return events;
}

// module.exports = { 
//   loadCommands, 
//   loadClientEvents, 
//   loadVoiceEvents, 
//   loadAudioEvents 
// }