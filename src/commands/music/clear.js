import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';

const command  = {
  data: new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear all songs in the playback'),

  async execute (interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply(`I'm not even in a channel... how would i have something queued idiot...`);
      return;
    }

    if (!connection.player) {
      await interaction.reply(`No player, you probs didn't join a channel. Idiot...`);
      return;
    }

    if (!connection.queue || connection.queue.length < 1) {
      interaction.reply('No songs in queue.');
      return;
    }

    try {
      connection.queue = [];
      await interaction.reply('Cleared queue');
    } catch (error) {
      console.log('error message', error)
    }

    // connection.player.stop();
    // connection.player.removeAllListeners(AudioPlayerStatus.Idle);
  }
};

export default command;