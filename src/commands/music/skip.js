const { SlashCommandBuilder, InteractionResponse } = require("discord.js")
const { EmbedBuilder } = require("discord.js")

const { getVoiceConnection, createAudioResource, createAudioPlayer } = require("@discordjs/voice")

const ytdl = require("@distube/ytdl-core")

const musicState = require('../../stores/musicStore')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song.'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id)

    if(!connection) {
      console.log(`i'm not in a channel..? so i can't be playing anything...? why skippo..?`)
      interaction.reply(`SunBot is currently not active in a voice channel and can't skip.`) // TODO: real msg
      return 
      // No action. Nothing to do. Other than reporting status to user.
      // "No action, not in channel idiot" TODO: Real msg
    }

    if(!connection.player) {
      // No player initialized, dont initialize? why would i? no songs queued
      // "Dumbass, no songs queued why u skip" TODO: Real msg
      interaction.reply('SunBot can only be used in a voice channel. Please join a voice channel and try again. Or provide a voice channel in the /join command')
      return
    }

    if(connection?.queue?.length < 1 ?? true) {
      // no items in queue? stop? yea
      connection.player.stop()

      // reply TODO: real msg
      interaction.reply('No songs in queue. Stopping playback. Use /play <url> to add songs to queue.')
      return
    }

    let next = connection.queue.shift()
    const info = await ytdl.getInfo(next.videoUrl)

    const audioStream = ytdl(next.videoUrl, {
      format: 'opus',
      filter: 'audioonly'
    })

    const embed = new EmbedBuilder()
      .setTitle(`${info.videoDetails.title}`)
      .setDescription(`${info.videoDetails.description}`)
      .setImage(info.videoDetails.thumbnails[0].url)
      .setURL(info.videoDetails.video_url)
      .setFooter({ text: `Skipping:\n${musicState.playing.title + '\n' + musicState.playing.videoUrl}` })
      
      const resource = createAudioResource(audioStream)
      connection.player.play(resource)

    // TODO: fancy msg with link to the video url

    interaction.reply({embeds: [embed]})
  }
}