import { VoiceConnectionStatus } from "@discordjs/voice";

export default {
  name: VoiceConnectionStatus.Ready,
  execute() {
    console.log('Ready voice connection...');
  }
}