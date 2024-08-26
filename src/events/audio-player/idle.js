import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';

import ytdl from '@distube/ytdl-core';

export default {
  name: AudioPlayerStatus.Idle,
  execute(connection, oldState, newState) {
    if (connection?.queue?.length > 0) {
      let next = connection.queue.shift();
      const audioStream = ytdl(next.videoUrl, {
        format: 'opus',
        filter: 'audioonly'
      });

      const resource = createAudioResource(audioStream);
      connection.player.play(resource);

      // TODO: interaction channel reply ("now playing song title etc");
    }
    else {
      // TODO: interaction channel reply ("queue empty etc etc")
    }
  }
}