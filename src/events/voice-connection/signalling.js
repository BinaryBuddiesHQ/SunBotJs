import { VoiceConnectionStatus } from "@discordjs/voice";

export default {
  name: VoiceConnectionStatus.Signalling,
  execute() {
    console.log('Signalling voice connection...');
  }
}