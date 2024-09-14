import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import mongodb from '../../data/db-context.js';

export default {
  data: new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear all songs in the queue'),

  async execute (interaction) {
    let player = await mongodb.getAsync("player", interaction.guild.id)

    if (player?.queue?.length < 1) {
      interaction.reply('No songs in queue.');
      return;
    }

    player.queue = [];
    await mongodb.createOrUpdateAsync("player", interaction.guild.id, player);

    await interaction.reply('Cleared queue');
  }
};