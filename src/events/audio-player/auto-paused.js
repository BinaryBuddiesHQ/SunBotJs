import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  name: AudioPlayerStatus.AutoPaused,
  execute(oldState, newState) {
    console.log('audio AutoPaused...');
  }
}