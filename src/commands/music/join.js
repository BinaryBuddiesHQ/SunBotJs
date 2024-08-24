// const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
import { joinVoiceChannel, createAudioPlayer } from  '@discordjs/voice';

// const {  } = require('discord.js');
import { SlashCommandBuilder, ChannelType } from 'discord.js';

// const {  } = require('../../services/loader-util');
import { loadVoiceEvents, loadAudioEvents } from '../../services/loader-util.js';

export default {
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

    const events = loadVoiceEvents();
    events.forEach(event => {
      connection.on(event.name, () => event.execute());
    });

    const player = createAudioPlayer();
    connection.player = player;
    connection.subscribe(player);
    
    const playerEvents = loadAudioEvents();
    playerEvents.forEach(event => {
      event.interaction = interaction;
      player.on(event.name, (...args) => event.execute(connection, ...args));
    });

    await interaction.reply(`Ready to rock!`);
  }
}