import { REST, Routes } from 'discord.js';
import { loadCommands } from './loader-util.js';
import config from '../config.json' assert  { type: 'json' };

const args = process.argv.slice(2);
const deployGlobal = args.includes('global');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.bot.token);

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
				? Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId)
				: Routes.applicationCommands(config.bot.clientId),
			{ body: commandsData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();