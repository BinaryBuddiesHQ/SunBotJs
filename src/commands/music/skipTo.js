import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { createAudioResourceFromUrl } from '../../services/audio-service.js';

export default {
  data: new SlashCommandBuilder()
  .setName('skipto')
  .setDescription('Skips to a specific song in the queue.')
  .addStringOption(option =>
    option.setName('input')
      .setDescription('What song do you want to skip to?')
      .setRequired(true) // TODO: not required. If no selection, dropdown with queue, select value, play song.
  ),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      interaction.reply(`SunBot is currently not active in a voice channel and can't skip.`);
      return;
    }

    if (!connection.player) {
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    const number = parseInt(interaction.options.getString('input'));

    if (isNaN(number) || number <= 0 || number > connection.queue.length) {
      const queueMessage = connection.queue.map((song, index) => `${index + 1}. [${song.title}](${song.videoUrl})`).join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`Invalid input. Please provide a number between 1 and the number of songs in the queue. Current queue:`)
        .setDescription(`${queueMessage}`);

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const currentSong = connection.queue[0];
    connection.queue.splice(0, number - 1);
    const next = connection.queue.shift();

    if (!next) {
      connection.player.stop();
      interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    }

    const resource = createAudioResourceFromUrl(next.videoUrl);
    connection.player.play(resource);

    const embed = new EmbedBuilder()
      .setTitle(`Now playing`)
      .setDescription(`[${next.title}](${next.videoUrl})`)
      .setColor('#FFD700')
      .setFooter({ text: `Skipping from: ${currentSong.title}. Queue length: ${connection.queue.length}` });

    interaction.reply({ embeds: [embed] });
  }
}
