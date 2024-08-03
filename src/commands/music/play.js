const { SlashCommandBuilder, ContextMenuCommandInteraction } = require('discord.js');
const { createAudioResource, getVoiceConnection, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('URL or query')
        .setRequired(true)
    ),

  async execute(interaction) {
    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      const channel = interaction.member.voice.channel;
      if (!channel) {
        interaction.reply('>:('); // TODO: real msg
        return;
      }

      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      const voiceEvents = require('../../services/load-voice-events');
      voiceEvents.forEach(event => {
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
    }

    const input = interaction.options.getString('input');
    const results = await ytSearch(input);

    if (!results?.videos && results?.videos?.length < 1) {
      interaction.reply("no hits m'dude");
      return;
    }

    const video = results.videos[0];

    const info = await ytdl.getInfo(video.url);
    const audioFormat = info.formats
      .filter(format => format.mimeType.startsWith('audio/'))
      .find(format => format.codecs.includes('opus'));

    if (!audioFormat) {
      console.log("No suitable audio format found.");
      interaction.reply("No suitable audio format found.");
      return;
    }

    // add to queue.
    // if playing queue it up
    if (connection.player.state.status === AudioPlayerStatus.Playing) {
      console.log("i'm already playing something, queue it up");

      if (!connection.queue)
        connection.queue = [];

      connection.queue.push({
        videoUrl: video.url,
        title: info.videoDetails.title
      });

      interaction.reply(`queueing: ${info.videoDetails.title}`);
    }
    else {
      console.log('start the song..?')
      const audioStream = ytdl(video.url, {
        // format: audioFormat,
        format: 'opus',
        filter: 'audioonly'
      });
  
      const resource = createAudioResource(audioStream);
      connection.player.play(resource);
  
      interaction.reply(`playing ${info.videoDetails.title}`);
    }
  }
}