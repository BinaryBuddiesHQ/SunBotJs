import { EmbedBuilder } from 'discord.js';
import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import mongodb from '../../data/db-context.js';

export default {
  name: AudioPlayerStatus.Idle,
  async execute(connection, interaction, oldState, newState) {
    let player = await mongodb.getAsync('player', connection.joinConfig.guildId);
    if (player.queue.length > 0) {

      let nextSong = player.queue.shift();
      const audioStream = ytdl(nextSong.videoUrl, {
        format: 'opus',
        filter: 'audioonly'
      });

      const resource = createAudioResource(audioStream);
      connection.player.play(resource);
      await mongodb.createOrUpdateAsync('player', connection.joinConfig.guildId, player);

      const embed = new EmbedBuilder()
        .setTitle(`Now playing`)
        .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
        .setColor('#FFD700')
        .setFooter({ text: `Queue length: ${player.queue.length}` });

      interaction.channel.send({ embeds: [embed] });
    }
    else {
      interaction.channel.send('Queue is empty, stopping playback.');
    }
  }
}