const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  name: AudioPlayerStatus.Buffering,
  execute(oldState, newState) {
    console.log('audio Buffering...');
  }
}