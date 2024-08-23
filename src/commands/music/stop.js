const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require ('discord.js');  // HACK : will be set in use later, just need it to work first.

const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

const ytdl = require('@distube/ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('stop')
  .setDescription(`Stops the current song in it's track`),

  async execute(interaction) {
    let connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      await interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command');
      return;
    }

    if(!connection.queue || connection.queue.length < 1) {
      // no items in queue? stop? yea
      connection.player.stop();
      await interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.');
      return;
    } else if (connection.queue.length > 0) {
      // TODO: reply "queue not empty, stop anyways?"
      connection.queue.shift();
      await interaction.reply('Queue not empty. Stopping playback. Use /start continue playing.');
    }

    connection.player.stop();
    connection.player.removeAllListeners(AudioPlayerStatus.Idle);
  }
}

/* TODO : There is some kind of issue where if you add songs to the queue the use the command /stop and then /start.
When there is only one song left in the queue and you try to use the /skip command it throws error.
My initial thoughts is that im using the shift() function improperly contra the messages being sent to discord. Or that something is not updating correctly. */