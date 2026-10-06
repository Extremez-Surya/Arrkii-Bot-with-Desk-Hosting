const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

module.exports = (client) => {
  const slashCommandsPath = path.join(__dirname, "../slashCommands");
  const data = [];
  let totalCommands = 0;

  fs.readdirSync(slashCommandsPath).forEach((dir) => {
    const slashCommandFiles = fs
      .readdirSync(path.join(slashCommandsPath, dir))
      .filter((file) => file.endsWith(".js"));
    for (const file of slashCommandFiles) {
      const slashCommand = require(path.join(slashCommandsPath, dir, file));
      if (!slashCommand.name || !slashCommand.description) continue;
      client.slashCommands.set(slashCommand.name, slashCommand);
      data.push({
        name: slashCommand.name,
        description: slashCommand.description,
        options: slashCommand.options || [],
      });
      totalCommands++;
    }
  });

  client.logger.log(`Slash Commands Loaded: ${totalCommands}`, "cmd");

  
  client.slashCommandData = data;
};
