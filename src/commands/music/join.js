const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
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

    let connection = undefined;

    if (!inputChannel) {
      const channel = await interaction.member.voice.channel;
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
    }
    else {
      connection = joinVoiceChannel({
        channelId: inputChannel.id,
        guildId: inputChannel.guild.id,
        adapterCreator: inputChannel.guild.voiceAdapterCreator,
        selfDeaf: false
      });
    }

    connection.on(VoiceConnectionStatus.Connecting, () => {
      console.log('Connecting voice connection...');
    })

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('destroyed voice connection...');
    })

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log('disconnected voice connection...');
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('ready voice connection...')
    })
    
    connection.on(VoiceConnectionStatus.Signalling, () => {
      console.log('signaling voice connection...');
    });

    await interaction.reply(`Ready to rock!`);
  }
}