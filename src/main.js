import { GatewayIntentBits, Client } from 'discord.js';
import { loadCommands, loadClientEvents } from './services/loader-util.js';
import { fileURLToPath } from 'url';  // this is part of the global.root folder path solution

import config  from './config.json' assert { type: 'json' };
import mongodb from './data/db-context.js';
import path from 'path';  // this is part of the global.root folder path solution

/*
Set global.root using import.meta.url
I could not get the path to the global.root to be set. The solution i found on the interwebz was that
you had to use fileURLtoPath and path.dirname to set the correct path to the folder otherwise the path would be undefined when using the npm run deploy.
So this is my solution.

https://stackoverflow.com/questions/75004188/what-does-fileurltopathimport-meta-url-do
This thread on SO wants you to do it like this though, but that doesn't seem to work: const __dirname = path.dirname(fileURLToPath(import.meta.url))
*/
const __filename = fileURLToPath(import.meta.url);  // this is part of the global.root folder path solution
const __dirname = path.dirname(__filename);  // this is part of the global.root folder path solution
global.root = __dirname;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = await loadCommands();
const events = await loadClientEvents();
events.forEach(event => {
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
});

client.login(config.bot.token);


process.on('uncaughtException', (error) => {
	console.error(('Uncaught exception: ', error));
});

process.on('SIGINT', async () => {
	gracefulShutdown();
});

process.on('SIGTERM', async () => {
	gracefulShutdown();
});

async function gracefulShutdown() {
	try {
		if (mongodb?.client) {
			await mongodb.client.close();
			console.log("MongoDB connection closed.");
		}

		await client.destroy();
		console.log('Client destroyed, exiting process.');
		process.exit(0);

	} catch (error) {
		console.error('Error during shutdown: ', error);
		process.exit(1);
	}
}