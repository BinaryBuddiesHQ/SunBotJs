import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

export async function loadCommands() {
  const commands = new Collection();
  /* 
  In main and deploy-commands i explain the issue i had with the path and i also found out that the npm run deploy command is not working untill you change the path of /commands to ../commands.
  But if you change it from /commands or just commands then the bot does not start so you have to change it back after you've deployed the new commands
  */

  /* 
  Another unrelated thing i found out is that if you just do 'npm run deploy' you get a cooldown until the slashcommand will show up in discord. 
  If you use 'npm run deploy global' it will work without cooldown.
  But then you get double commands, hmmmm.
  */
  const foldersPath = path.join(global.root, '/commands');

  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = `file://${path.join(commandsPath, file)}`;
      const command = await import(filePath).then(module => module.default);

      if (command && 'data' in command && 'execute' in command) {
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
  const eventsPath = path.join(global.root, '/events/client');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = `file://${path.join(eventsPath, file)}`;
    const event = await import(filePath).then(module => module.default);
    events.push(event);
  }

  return events;
}

export async function loadVoiceEvents() {
  const events = [];
  const eventsPath = path.join(global.root, '/events/voice-connection');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = `file://${path.join(eventsPath, file)}`;
    const event = await import(filePath).then(module => module.default);
    events.push(event);
  }

  return events;
}

export async function loadAudioEvents() {
  const events = [];
  const eventsPath = path.join(global.root, '/events/audio-player');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = `file://${path.join(eventsPath, file)}`;
    const event = await import(filePath).then(module => module.default);
    events.push(event);
  }

  return events;
}