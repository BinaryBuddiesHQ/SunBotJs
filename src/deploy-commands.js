import { REST, Routes } from 'discord.js';
import { loadCommands } from './services/loader-util.js';

global.root = import.meta.dirname;

const args = process.argv.slice(2);
const deployGlobal = args.includes('global');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.BOT_TOKEN);

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
				? Routes.applicationCommands(process.env.BOT_CLIENT_ID)
				: Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.BOT_GUILD_ID),
			{ body: commandsData },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();