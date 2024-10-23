import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getVoiceConnection, createAudioResource } from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";
import mongodb from "../../data/db-context.js";

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song.'),

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

    let player = await mongodb.getAsync("player", interaction.guild.id);
    let nextSong = player?.queue?.shift();

    if (!nextSong) {
      connection.player.stop();
      interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    }

    const audioStream = ytdl(nextSong.videoUrl, {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      },
    });

    const embed = new EmbedBuilder()
      .setTitle(`Now playing`)
      .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
      .setColor('#FFD700')
      .setFooter({ text: `Queue length: ${player.queue.length}` });

    const resource = createAudioResource(audioStream);
    connection.player.play(resource);
    await mongodb.createOrUpdateAsync("player", interaction.guild.id, player);

    interaction.reply({ embeds: [embed] });
  }
}