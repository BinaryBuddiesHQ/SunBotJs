const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  name: AudioPlayerStatus.Paused,
  execute(oldState, newState) {
    console.log('audio Paused...');
  }
}