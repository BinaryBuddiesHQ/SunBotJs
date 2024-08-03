const fs = require('fs');
const path = require('path');

const events = [];
const eventsPath = path.join(__dirname, '../events/audio-player');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
  events.push(event);
}

module.exports = events;