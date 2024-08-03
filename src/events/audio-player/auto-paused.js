const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  name: AudioPlayerStatus.AutoPaused,
  execute(oldState, newState) {
    console.log('audio AutoPaused...');
  }
}