// const { Collection } = require('discord.js');
import { Collection } from 'discord.js';

import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands() {
  const commands = new Collection();
  // const dirname = url.fileURLToPath(new URL(import.meta.url));
  const foldersPath = path.join(__dirname, '../commands');

  const commandFolders = fs.readdirSync(foldersPath);
  

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {

      const filePath = path.join(commandsPath, file);
      const fileUrl =  pathToFileURL(filePath).href;
      const command = await import(fileUrl)

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
  
  console.log(`Scanning directory: ${eventsPath}`); // Log the directory being scanned

  try {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const fileUrl = pathToFileURL(filePath).href; // Ensure it is a valid URL string
      try {
        const event = await import(fileUrl);
        events.push(event);
      } catch (error) {
        console.error(`Failed to import ${fileUrl}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to read directory: ${eventsPath}`, error);
  }

  return events;
}

export async function loadVoiceEvents() {
  const events = [];
  const eventsPath = path.join(__dirname, '../events/voice-connection');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const fileUrl =  pathToFileURL(filePath).href;
    const event = await import(fileUrl);
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
    const fileUrl =  pathToFileURL(filePath).href;
    const event = await import(fileUrl);
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