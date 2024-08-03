const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: VoiceConnectionStatus.Ready,
  execute(oldState, newState) {
    console.log(`Voice connection ready!`);
  }
}