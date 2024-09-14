import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import mongodb from '../../data/db-context.js';

export default {
  data: new SlashCommandBuilder()
  .setName('stop')
  .setDescription(`Stops the current song`),

  async execute(interaction) {
    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      await interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    connection.player.stop();
    await interaction.reply('Stopping playback.');
  }
}