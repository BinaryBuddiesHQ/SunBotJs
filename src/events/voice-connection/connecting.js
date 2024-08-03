const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Connecting,
  execute() {
    console.log('Connecting voice connection...');
  }
}