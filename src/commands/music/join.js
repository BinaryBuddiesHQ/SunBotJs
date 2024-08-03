const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins your current channel, or a channel of your choice.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to join')
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction) {
    const inputChannel = interaction.options.getChannel('channel') 
      ?? interaction.member.voice.channel;

    if (!inputChannel) {
      interaction.reply('Join a channel to summon me, or provide a channel in the /join command.');
      return;
    }

    connection = joinVoiceChannel({
      channelId: inputChannel.id,
      guildId: inputChannel.guild.id,
      adapterCreator: inputChannel.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    const events = require('../../services/load-voice-events');
    events.forEach(event => {
      connection.on(event.name, () => event.execute());
    });

    const player = createAudioPlayer();
    connection.player = player;
    connection.subscribe(player);
    
    const playerEvents = require('../../services/load-audio-events');
    playerEvents.forEach(event => {
      event.interaction = interaction;
      player.on(event.name, (...args) => event.execute(connection, ...args));
    });

    await interaction.reply(`Ready to rock!`);
  }
}