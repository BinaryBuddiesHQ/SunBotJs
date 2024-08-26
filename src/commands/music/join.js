import { joinVoiceChannel, createAudioPlayer } from  '@discordjs/voice';
import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { loadVoiceEvents, loadAudioEvents } from '../../services/loader-util.js';

const command =  {
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

    const events = await loadVoiceEvents();
    events.forEach(event => {
      connection.on(event.name, () => event.execute());
    });

    const player = createAudioPlayer();
    connection.player = player;
    connection.subscribe(player);
    
    const playerEvents = await loadAudioEvents();
    playerEvents.forEach(event => {
      event.interaction = interaction;
      player.on(event.name, (...args) => event.execute(connection, ...args));
    });

    await interaction.reply(`Ready to rock!`);
  }
}

export default command;