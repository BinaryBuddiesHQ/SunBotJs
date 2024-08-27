import { REST, Routes } from 'discord.js';

import { loadCommands } from './loader-util.js';

import config from '../config.json' assert  { type: 'json' };
const { clientId, guildId, token } = config.bot;

const args = process.argv.slice(2);
const deployGlobal = args.includes('global');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
    const commands = await loadCommands();
    const commandsArray = Array.from(commands.values());
    const commandsData = commandsArray.map(x => x.data.toJSON());

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			deployGlobal 
				? Routes.applicationGuildCommands(clientId, guildId)
				: Routes.applicationCommands(clientId),
			{ body: commandsData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();