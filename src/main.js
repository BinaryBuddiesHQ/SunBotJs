const { GatewayIntentBits, Client } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildVoiceStates
	] 
});

client.commands = require('./services/load-commands');
const events = require('./services/event-handler');
events.forEach(event => {
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
});

client.login(token);



process.on('uncaughtException', (error) => {
	console.error(('Uncaught exception: ', error));
});