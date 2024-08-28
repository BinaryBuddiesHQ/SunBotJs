import { REST, Routes } from 'discord.js';
import { loadCommands } from './loader-util.js';
import { fileURLToPath } from 'url';  // this is part of the global.root folder path solution

import config from '../config.json' assert  { type: 'json' };
import path from 'path';  // this is part of the global.root folder path solution

/*
Set global.root using import.meta.url.

I could not get the path to the global.root to be set. The solution i found on the interwebz was that
you had to use fileURLtoPath and path.dirname to set the correct path to the folder otherwise the path would be undefined when using the npm run deploy.
So this is my solution 

https://stackoverflow.com/questions/75004188/what-does-fileurltopathimport-meta-url-do
This thread on SO wants you to do it like this though, but that doesn't seem to work: const __dirname = path.dirname(fileURLToPath(import.meta.url))
*/
const __filename = fileURLToPath(import.meta.url);  // this is part of the global.root folder path solution
const __dirname = path.dirname(__filename);  // this is part of the global.root folder path solution
global.root = __dirname;

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