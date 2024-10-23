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
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          },
        },
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