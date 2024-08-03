const { AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = {
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

      // interaction channel reply ("now playing song title etc");
    }
    else {
      // ?
    }

  }
}