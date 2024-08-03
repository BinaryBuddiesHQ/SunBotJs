
module.exports = {
  name: 'error',
  execute(error) {
    console.log('error occured');
    console.error(error);

    // handle something something
  }
}