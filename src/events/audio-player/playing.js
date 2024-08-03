const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  name: AudioPlayerStatus.Playing,
  execute(connection, oldState, newState) {
    console.log('audio Playing...');
    console.log(connection);
  }
}