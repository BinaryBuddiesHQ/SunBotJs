import { VoiceConnectionStatus } from "@discordjs/voice";

export default {
  name: VoiceConnectionStatus.Destroyed,
  execute() {
    console.log('Destroyed voice connection...');
  }
}