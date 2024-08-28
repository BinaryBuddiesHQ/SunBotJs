import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection, createAudioResource } from '@discordjs/voice';

import ytdl from '@distube/ytdl-core';

export default {
  data: new SlashCommandBuilder()
  .setName('skipto')
  .setDescription('Skips to a specific song in the queue.')
  .addStringOption(option => 
    option.setName('input')
      .setDescription('What song do you want to skip to?')
      .setRequired(true)
  ),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if(!connection) {
      console.log(`I'm not in a channel..? So I can't be playing anything...? Why skippo..?`);
      interaction.reply(`SunBot is currently not active in a voice channel and can't skip.`);
      return;
      // No action. Nothing to do. Other than reporting status to user.
    }

    if(!connection.player) {
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    let number = parseInt(interaction.options.getString('input'));

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
    let next = connection.queue[0];
   
    

    if (!connection.queue || connection.queue.length < 1) {
      // no items in queue? stop? yea
      connection.player.stop();

      interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    }

    const info = await ytdl.getInfo(next.videoUrl);
    const audioStream = ytdl(next.videoUrl, {
      format: 'opus',
      filter: 'audioonly'
    });

    const embed = new EmbedBuilder()
      .setTitle(`${info.videoDetails.title}`)
      .setDescription(`${info.videoDetails.description.substring(0, 250)}`)
      .setImage(info.videoDetails.thumbnails[0].url)
      .setURL(info.videoDetails.video_url)
      .setFooter({ text: `Skipping: ${currentSong.title} ${currentSong.videoUrl}` });

    const resource = createAudioResource(audioStream);
    connection.player.play(resource);

    interaction.reply({ embeds: [embed] });
  }
}