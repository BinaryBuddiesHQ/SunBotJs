import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { loadVoiceEvents, loadAudioEvents } from '../../services/loader-util.js';
import {createAudioResource, getVoiceConnection, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus} from '@discordjs/voice';

import ytSearch from 'yt-search'
import ytdl from'@distube/ytdl-core';

const command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('URL or query')
        .setRequired(true)
    ),

  async execute(interaction) {
    const connection = await this.getOrCreateVoiceConnection(interaction);
    if (!connection) {
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    } 

    const input = interaction.options.getString('input');
    const results = await ytSearch(input);

    if (!results?.videos && results?.videos?.length < 1) {
      interaction.reply("Could not find any songs or videos to match your query");
      return;
    }

    const video = results.videos[0];
    const info = await ytdl.getInfo(video.url);  // TODO : somwhere here the currently playing song should be queued up. Find a way to save it.

    const embed = new EmbedBuilder()
      .setTitle(`${info.videoDetails.title}`)
      .setDescription(`${info.videoDetails.description.substring(0, 250)}`)
      .setImage(info.videoDetails.thumbnails[0].url)
      .setFooter({ text: `${ info.videoDetails.video_url }` });

    // add to queue.
    // if playing queue it up
    if (connection.player.state.status === AudioPlayerStatus.Playing) {
      console.log("i'm already playing something, queue it up");

      connection.queue ??= [];
      connection.queue.push({
        videoUrl: video.url,
        title: info.videoDetails.title
      });

      interaction.reply({ embeds: [embed] });

    } else {
      // might throw error when no opus? maybe try catch here
      // Added try/catch clause. Update: Might need better error handling than "console.log (e)" though.
      try {
        const audioStream = ytdl(video.url, {
          format: 'opus',
          filter: 'audioonly'
        });
  
        const resource = createAudioResource(audioStream);
        connection.player.play(resource);
  
        interaction.reply({ embeds: [embed] });

        connection.queue = [{
          videoUrl: video.url,
          title: info.videoDetails.title
        }];

      } catch (e) {
        console.log(e);
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
    connection.subscribe(player);

    const playerEvents = await loadAudioEvents();
    playerEvents.forEach(event => {
      event.interaction = interaction
      player.on(event.name, (...args) => event.execute(connection, ...args));
    });

    return connection;
  }
}

export default command;