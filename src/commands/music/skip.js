import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { getVoiceConnection, createAudioResource } from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      console.log(`i'm not in a channel..? so i can't be playing anything...? why skippo..?`);
      interaction.reply(`SunBot is currently not active in a voice channel and can't skip.`);
      return;
      // No action. Nothing to do. Other than reporting status to user.
      // "No action, not in channel idiot" TODO: Real msg
    }

    if (!connection.player) {
      // No player initialized, dont initialize? why would i? no songs queued
      // "Dumbass, no songs queued why u skip" TODO: Real msg
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    const currentSong = connection.queue[0];
    connection.queue.shift();
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