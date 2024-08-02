const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies With pong!'),
    
  async execute(interaction) {
    console.log(interaction);

    await interaction.reply('Pong!');
  }
}