import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { loadVoiceEvents, loadAudioEvents } from '../../services/loader-util.js';
import { getVoiceConnection, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import ytSearch from 'yt-search'
import { getVideoInfo, createAudioResourceFromUrl } from '../../services/audio-service.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('URL or query')
        .setRequired(false)
    ),

  async execute(interaction) {
    const connection = await this.getOrCreateVoiceConnection(interaction);
    if (!connection) {
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    const input = interaction.options.getString('input');
    if (!input && connection.player.state.status === AudioPlayerStatus.Playing) {
      interaction.reply('Already playing a song, provide a query or url to queue it up!');
      return;
    }

    if (!input) {
      if (connection.queue.length < 1) {
        interaction.reply('No songs in queue');
        return;
      }

      const nextSong = connection.queue.shift();
      const resource = createAudioResourceFromUrl(nextSong.videoUrl);
      connection.player.play(resource);

      const embed = new EmbedBuilder()
        .setTitle(`Now playing`)
        .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
        .setColor('#FFD700')
        .setFooter({ text: `Queue length: ${connection.queue.length}` });

      interaction.reply({ embeds: [embed] });
    }
    else {
      await interaction.deferReply();

      const results = await ytSearch(input);
      if (!results?.videos?.length) {
        interaction.editReply("Could not find any songs that match your query");
        return;
      }

      const video = results.videos[0];
      const info = await getVideoInfo(video.url);
      connection.queue.push(info);

      if (connection.player.state.status === AudioPlayerStatus.Playing) {
        const latestEntry = connection.queue[connection.queue.length - 1];

        const embed = new EmbedBuilder()
          .setTitle(`Added to queue`)
          .setDescription(`[${latestEntry.title}](${latestEntry.videoUrl})`)
          .setColor('#FFD700')
          .setFooter({ text: `Queue length: ${connection.queue.length}` });

        interaction.editReply({ embeds: [embed] });
      }
      else {
        const nextSong = connection.queue.shift();
        const resource = createAudioResourceFromUrl(nextSong.videoUrl);
        connection.player.play(resource);

        const embed = new EmbedBuilder()
          .setTitle(`Now playing`)
          .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
          .setColor('#FFD700')
          .setFooter({ text: `Queue length: ${connection.queue.length}` });

        interaction.editReply({ embeds: [embed] });
      }
    }
  },

  async getOrCreateVoiceConnection(interaction) {
    // Check if existing connection
    let connection = getVoiceConnection(interaction.guild.id);
    if (connection) return connection;

    // No existing connection, and interaction member is not in a channel.
    const channel = interaction.member.voice.channel;
    if (!channel) return undefined;

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    // init voice events
    const voiceEvents = await loadVoiceEvents();
    voiceEvents.forEach(event => {
      connection.on(event.name, () => event.execute());
    });

    // init player and player events
    const player = createAudioPlayer();
    connection.player = player;
    connection.queue = [];
    connection.subscribe(player);

    const playerEvents = await loadAudioEvents();
    playerEvents.forEach(event => {
      event.interaction = interaction
      player.on(event.name, (...args) => event.execute(connection, interaction, ...args));
    });

    return connection;
  }
}
