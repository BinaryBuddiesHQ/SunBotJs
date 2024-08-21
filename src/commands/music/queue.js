const { getVoiceConnection, createAudioResource, createAudioPlayer } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const { SlashCommandBuilder, InteractionResponse } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply("I'm not even in a channel... how would i have something queued idiot...");
      return;
    }

    if (!connection.player) {
      await interaction.reply("No player, you probs didn't join a channel. Idiot...");
      return;
    }

    if (connection?.queue?.length < 1) {
      await interaction.reply("No songs in queue. Stopping playback...");
      return;
    }

    if(connection?.queue?.length < 1 ?? true) {
      // no items in queue? stop? yea
      connection.player.stop();
      // reply TODO: real msg
      interaction.reply("No songs in queue. Stopping playback.");
      return;
    }

    interaction.reply(`Queue:\n${connection.queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n')}`);
  }
}