const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  name: AudioPlayerStatus.Playing,
  execute(oldState, newState) {
    console.log('Audio player is in the playing state!');
  }
}