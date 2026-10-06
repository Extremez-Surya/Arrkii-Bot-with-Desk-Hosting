const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const playerEventsPath = path.join(__dirname, "../events/Players");
  let totalEvents = 0;

  fs.readdirSync(playerEventsPath).forEach((file) => {
    const event = require(path.join(playerEventsPath, file));
    client.manager.on(event.name, (...args) => event.run(client, ...args));
    totalEvents++;
  });

  client.logger.log(`Player Events Loaded: ${totalEvents}`, "event");
};
