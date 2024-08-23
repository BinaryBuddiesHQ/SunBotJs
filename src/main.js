const { GatewayIntentBits, Client } = require('discord.js');
const { token } = require('./config.json');
const { loadCommands, loadClientEvents } = require('./services/loader-util');
const { mongodb } = require('./data/db-context.js');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = loadCommands();
const events = loadClientEvents();
events.forEach(event => {
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
});

client.login(token);


process.on('uncaughtException', (error) => {
	console.error(('Uncaught exception: ', error));
});

process.on('SIGINT', async () => {
	gracefulShutdown();
});

process.on('SIGTERM', async () => {
	gracefulShutdown();
});

gracefulShutdown = async () => {
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