/* A music state store to have a shared state of the songs in the queue. 
Currently the queue is not being used since there is already a function for this.
Right now this is only used to keep track of the previous played song when using the /skip command, in the footer of the embedded message 
*/

const musicState = {
  queue: [],
  playing: {}
}

module.exports = musicState