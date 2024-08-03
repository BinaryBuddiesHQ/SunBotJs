const { VoiceConnectionStatus } = require("@discordjs/voice");

module.exports = {
  name: VoiceConnectionStatus.Signalling,
  execute() {
    console.log('Signalling voice connection...');
  }
}