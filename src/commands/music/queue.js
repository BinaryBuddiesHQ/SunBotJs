const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { getVoiceConnection} = require("@discordjs/voice");

const ytdl = require("@distube/ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply("I'm not even in a channel... how would i have something queued idiot...");
      return;
    }

    if (!connection.player) {
      await interaction.reply("No player, you probs didn't join a channel. Idiot...");
      return;
    }
    
    if (!connection.queue || connection.queue.length < 1) {
      await interaction.reply('No songs in queue.');
      return;
    }

    try {
      const queueMessage = connection.queue.map((song, index) => `${index + 1}. [${song.title}](${song.videoUrl})`).join('\n');

      const embed = new EmbedBuilder()
      .setTitle(`Current Queue`)
      .setDescription(`${queueMessage}`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error)
      await interaction.reply("An error occured while fetching the queue.");
    }
  }
}