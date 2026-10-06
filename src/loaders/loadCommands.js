const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const commandsPath = path.join(__dirname, "../commands");
  let totalCommands = 0;

  fs.readdirSync(commandsPath).forEach((dir) => {
    const commandFiles = fs
      .readdirSync(path.join(commandsPath, dir))
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, dir, file));
      client.commands.set(command.name, command);
      totalCommands++;
    }
  });

  client.logger.log(`Prefix Commands Loaded: ${totalCommands}`, "cmd");
};
