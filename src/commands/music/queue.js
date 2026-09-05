import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection || connection.queue.length < 1) {
      await interaction.reply('No songs in queue');
      return;
    }

    const queueMessage = connection.queue.map((song, index) => `${index + 1}. [${song.title}](${song.videoUrl})`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`Current Queue`)
      .setDescription(`${queueMessage}`)
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  }
}
