import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear all songs in the queue'),

  async execute (interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection || connection.queue.length < 1) {
      interaction.reply('No songs in queue.');
      return;
    }

    connection.queue = [];
    await interaction.reply('Cleared queue');
  }
};
