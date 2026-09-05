import { EmbedBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { createAudioResourceFromUrl } from '../../services/audio-service.js';

export default {
  name: AudioPlayerStatus.Idle,
  async execute(connection, interaction, oldState, newState) {
    if (connection.queue.length > 0) {
      const nextSong = connection.queue.shift();
      const resource = createAudioResourceFromUrl(nextSong.videoUrl);
      connection.player.play(resource);

      const embed = new EmbedBuilder()
        .setTitle(`Now playing`)
        .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
        .setColor('#FFD700')
        .setFooter({ text: `Queue length: ${connection.queue.length}` });

      interaction.channel.send({ embeds: [embed] });
    }
    else {
      interaction.channel.send('Queue is empty, stopping playback.');
    }
  }
}
