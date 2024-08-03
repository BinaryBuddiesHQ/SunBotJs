const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  name: AudioPlayerStatus.Idle,
  execute(context, oldState, newState) {
    console.log('audio Idle...');
    console.log(context);
  }
}