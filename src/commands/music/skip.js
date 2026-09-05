import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { createAudioResourceFromUrl } from "../../services/audio-service.js";

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

    const nextSong = connection.queue.shift();

    if (!nextSong) {
      connection.player.stop();
      interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    }

    const resource = createAudioResourceFromUrl(nextSong.videoUrl);
    connection.player.play(resource);

    const embed = new EmbedBuilder()
      .setTitle(`Now playing`)
      .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
      .setColor('#FFD700')
      .setFooter({ text: `Queue length: ${connection.queue.length}` });

    interaction.reply({ embeds: [embed] });
  }
}
