const { getVoiceConnection } = require('@discordjs/voice')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      await interaction.reply(`>:(`);
      return;
    }

    connection.disconnect();
    connection.destroy();
    await interaction.reply(`cya`);
  }
}