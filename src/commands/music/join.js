const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your current channel, or a channel of your choice.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to join')
    ),

  async execute(interaction) {
    const inputChannel = interaction.options.getChannel('channel');

    if (!inputChannel) {
      const channel = await interaction.member.voice.channel;
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
    }
    else {
      joinVoiceChannel({
        channelId: inputChannel.id,
        guildId: inputChannel.guild.id,
        adapterCreator: inputChannel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
    }

    await interaction.reply(`Ready to rock!`);
  }
}