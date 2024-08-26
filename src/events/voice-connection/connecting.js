import { VoiceConnectionStatus } from "@discordjs/voice";

export default {
  name: VoiceConnectionStatus.Connecting,
  execute() {
    console.log('Connecting voice connection...');
  }
}