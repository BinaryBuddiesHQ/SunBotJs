import { VoiceConnectionStatus } from "@discordjs/voice";

export default {
  name: VoiceConnectionStatus.Disconnected,
  execute() {
    console.log('Disconnected voice connection...');
  }
}