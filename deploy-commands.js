const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./credentials.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(path.join(commandsPath, file));
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log('🔄 Refreshing application (/) commands...');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),  
			{ body: commands },
		);

		console.log('✅ Successfully reloaded application (/) commands!');
	} catch (error) {
		console.error(error);
	}
})();
