import { GatewayIntentBits, Client } from 'discord.js';
import { loadCommands, loadClientEvents } from './services/loader-util.js';
import config  from './config.json' assert { type: 'json' };
import mongodb from './data/db-context.js';
global.root = import.meta.dirname;

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