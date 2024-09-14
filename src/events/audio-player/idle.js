import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';

import ytdl from '@distube/ytdl-core';
import mongodb from '../../data/db-context.js';

export default {
  name: AudioPlayerStatus.Idle,
  execute(connection, oldState, newState) {
    if (connection?.queue?.length > 0) {
      
      // Guild how..?
      // let player = mongodb.getAsync("player", connection.)
      
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