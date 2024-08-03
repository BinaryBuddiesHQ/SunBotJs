const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Disconnected,
  execute() {
    console.log('Disconnected voice connection...');
  }
}