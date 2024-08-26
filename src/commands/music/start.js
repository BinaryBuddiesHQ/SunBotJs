import { SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import { getVoiceConnection, createAudioResource } from '@discordjs/voice';

import ytdl  from '@distube/ytdl-core'

export default {
  data: new SlashCommandBuilder()
  .setName('start')
  .setDescription('Starts the current song in it\'s track'),

  async execute(interaction) {
    let connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command.');
      return;
    }

    if (!connection.player || !connection.queue || connection.queue.length < 1) {
      interaction.reply('No songs in queue. Use /play <url> to add songs to queue.');
      return;
    }

    const nextSong = connection.queue[0];

    const info = await ytdl.getInfo(nextSong.videoUrl);
    const audioStream = ytdl(nextSong.videoUrl, {
      format: 'opus',
      filter: 'audioonly'
    });

    const resource = createAudioResource(audioStream);
    connection.player.play(resource);

    const embed = new EmbedBuilder()
    .setTitle(`${info.videoDetails.title}`)
    .setDescription(`${info.videoDetails.description.substring(0, 250)}`)
    .setImage(info.videoDetails.thumbnails[0].url)
    .setFooter({ text: nextSong.videoUrl });

    await interaction.reply({ embeds: [embed] });

    connection.queue.shift();
  }
}

/* TODO : There is some kind of issue where if you add songs to the queue the use the command /stop and then /start.
When there is only one song left in the queue and you try to use the /skip command it throws error.
My initial thoughts is that im using the shift() function improperly contra the messages being sent to discord. Or that something is not updating correctly. */