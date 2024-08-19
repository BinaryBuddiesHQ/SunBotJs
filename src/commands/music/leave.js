const { getVoiceConnection } = require('@discordjs/voice')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave'),

  async execute(interaction) {
    try {
      const connection = getVoiceConnection(interaction.guild.id)

      if (!connection) {
        await interaction.reply(`SunBot can't leave a channel if SunBot isn't in one!`)
        return
      }
  
      connection.disconnect()
      connection.destroy()

      await interaction.reply(`SunBot has left the voice channel`)

    } catch(error) {
      console.error('Error executing leave command:', error)
      await interaction.reply('An error occurred while trying to leave the voice channel.')
    }
  }
}