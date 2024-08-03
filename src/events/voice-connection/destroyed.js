const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Destroyed,
  execute() {
    console.log('Destroyed voice connection...');
  }
}