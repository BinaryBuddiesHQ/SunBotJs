import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  name: AudioPlayerStatus.Buffering,
  execute(oldState, newState) {
    console.log('audio Buffering...');
  }
}