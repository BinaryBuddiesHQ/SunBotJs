const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Ready,
  execute() {
    console.log('Ready voice connection...');
  }
}