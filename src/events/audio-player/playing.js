import { AudioPlayerStatus } from '@discordjs/voice';

export default {
  name: AudioPlayerStatus.Playing,
  execute(connection, oldState, newState) {
    console.log('audio Playing...');
  }
}