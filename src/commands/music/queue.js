import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mongodb from "../../data/db-context.js";

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue.'),

  async execute(interaction) {
    let player = await mongodb.getAsync("player", interaction.guild.id);

    if (player?.queue && player?.queue.length < 1) {
      await interaction.reply('No songs in queue');
      return;
    }

    let queueMessage = player?.queue.map((song, index) => `${index + 1}. [${song.title}](${song.videoUrl})`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`Current Queue`)
      .setDescription(`${queueMessage}`)
      .setColor('#FFD700');

    await interaction.reply({ embeds: [embed] });
  }
}