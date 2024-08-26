import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  name: AudioPlayerStatus.Paused,
  execute(oldState, newState) {
    console.log('audio Paused...');
  }
}