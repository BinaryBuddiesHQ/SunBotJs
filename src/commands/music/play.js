const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource, createAudioPlayer, getVoiceConnection, StreamType } = require('@discordjs/voice');
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
    const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/[^\/]+\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const input = interaction.options.getString('input');

    // const client = interaction.client;
    // console.log(client);
    // Queue on client..? if song is already playing, add to queue
    // Event handler for when audio stopd, check if queue has any
    // do next
    // stop playing

    // play command queues up songs? some kinda voiceevent dequeues?

    if (youtubePattern.test(input)) {
      // just get the link and scrape and play
      console.log("input is a youtube link.");
    }
    else {
      const results = await ytSearch(input);

      if (results?.videos && results.videos.length > 0) {
        const video = results.videos[0];

        const info = await ytdl.getInfo(video.url);
        const audioFormat = info.formats
          .filter(format => format.mimeType.startsWith('audio/'))
          .find(format => format.codecs.includes('opus'));

        if (!audioFormat) {
          console.log("No suitable audio format found.");
          Integration.reply("No suitable audio format found.");
          return;
        }

        const audioStream = ytdl(video.url, {
          format: audioFormat,
        });

        const resource = createAudioResource(audioStream);
        const connection = getVoiceConnection(interaction.guild.id);
        const player = createAudioPlayer();

        connection.subscribe((player));
        player.play(resource);

        interaction.reply("foobar"); // TODO: current song
      }
      else {
        interaction.reply("Couldn't find the video m'dude..");
      }
    }
  }
}