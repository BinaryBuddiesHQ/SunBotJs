import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';

export default {
  data: new SlashCommandBuilder()
  .setName('stop')
  .setDescription(`Stops the current song in it's track`),

  async execute(interaction) {
    let connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    if(!connection.queue || connection.queue.length < 1) {
      // no items in queue? stop? yea
      connection.player.stop();
      await interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    } else if (connection.queue.length > 0) {
      connection.queue.shift();
      await interaction.reply('Queue not empty. Stopping playback. Use /start continue playing.');
    }

    connection.player.stop();
    connection.player.removeAllListeners(AudioPlayerStatus.Idle);
  }
}