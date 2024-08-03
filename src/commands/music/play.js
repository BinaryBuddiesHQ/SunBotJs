const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
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

    const audioStream = ytdl(video.url, {
      // format: audioFormat,
      format: 'opus',
      filter: 'audioonly'
    });

    const resource = createAudioResource(audioStream);
    const connection = getVoiceConnection(interaction.guild.id);
    
    if(!connection.queue)
      connection.queue = []; 
    
    connection.queue.push(info.videoDetails.title);
    


    connection.player.play(resource);
    
    
    
    interaction.reply("foobar"); // TODO: current song
  }
}