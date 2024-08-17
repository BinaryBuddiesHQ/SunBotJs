const { getVoiceConnection, createAudioResource, createAudioPlayer } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const { SlashCommandBuilder, InteractionResponse } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if(!connection) {
      console.log("i'm not in a channel..? so i can't be playing anything...? why skippo..?");
      interaction.reply("I'm not even in a channel... how would i have something queued idiot..."); // TODO: real msg
      return; 
      // No action. Nothing to do. Other than reporting status to user. 
      // "No action, not in channel idiot" TODO: Real msg
    }

    if(!connection.player) {
      // No player initialized, dont initialize? why would i? no songs queued
      // "Dumbass, no songs queued why u skip" TODO: Real msg
      interaction.reply("No player, you probs didn't join a channel. Idiot...");
      return;
    }

    if(!connection.queue) {
      // no items in queue? stop? yea
      connection.player.stop();
      // reply TODO: real msg
      interaction.reply("No songs in queue. Stopping playback.");
      return;
    }

    let next = connection.queue.shift();
    const audioStream = ytdl(next.videoUrl, {
      format: 'opus',
      filter: 'audioonly'
    });

    const resource = createAudioResource(audioStream);
    connection.player.play(resource);
    // TODO: fancy msg with link to the video url
    interaction.reply(`playing ${next.title}`);
  }
}