import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { loadVoiceEvents, loadAudioEvents } from '../../services/loader-util.js';
import { createAudioResource, getVoiceConnection, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import ytSearch from 'yt-search'
import ytdl from '@distube/ytdl-core';
import mongodb from '../../data/db-context.js';

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

    let player = await mongodb.getAsync("player", interaction.guild.id);

    if (!input) {
      if (player?.queue && player?.queue < 1) {
        interaction.reply('No songs in queue');
        return;
      }

      const nextSong = player?.queue?.shift();
      const audioStream = ytdl(nextSong.videoUrl, {
        format: 'opus',
        filter: 'audioonly'
      });

      const resource = createAudioResource(audioStream);
      connection.player.play(resource);

      const embed = new EmbedBuilder()
        .setTitle(`Now playing`)
        .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
        .setColor('#FFD700')
        .setFooter({ text: `Queue lenght: ${player.queue.length}` });

      interaction.reply({ embeds: [embed] });
    }
    else {
      const results = await ytSearch(input);
      if (!results?.videos?.length > 1) {
        interaction.reply("Could not find any songs that match your query");
        return;
      }

      const video = results.videos[0];
      const info = await ytdl.getInfo(video.url);
      player.queue ??= [];
      player.queue.push({
        title: info.videoDetails.title,
        description: info.videoDetails.description.substring(0, 250),
        thumbnail: info.videoDetails.thumbnails[0].url,
        videoUrl: video.url,
      });

      if (connection.player.state.status === AudioPlayerStatus.Playing) {
        let latestEntry = player.queue[player.queue.length - 1];

        const embed = new EmbedBuilder()
          .setTitle(`Added to queue`)
          .setDescription(`[${latestEntry.title}](${latestEntry.videoUrl})`)
          .setColor('#FFD700')
          .setFooter({ text: `Queue lenght: ${player.queue.length}` });

        interaction.reply({ embeds: [embed] });
      }
      else {
        const nextSong = player.queue.shift();
        const audioStream = ytdl(nextSong.videoUrl, {
          format: 'opus',
          filter: 'audioonly'
        });

        const resource = createAudioResource(audioStream);
        connection.player.play(resource);
        const embed = new EmbedBuilder()
          .setTitle(`Now playing`)
          .setDescription(`[${nextSong.title}](${nextSong.videoUrl})`)
          .setColor('#FFD700')
          .setFooter({ text: `Queue lenght: ${player.queue.length}` });

        interaction.reply({ embeds: [embed] });
      }
    }

    await mongodb.createOrUpdateAsync("player", interaction.guild.id, player);
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
    connection.subscribe(player);

    const playerEvents = await loadAudioEvents();
    playerEvents.forEach(event => {
      event.interaction = interaction
      player.on(event.name, (...args) => event.execute(connection, ...args));
    });

    return connection;
  }
}