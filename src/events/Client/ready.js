/** @format */

const { prefix } = require("../../config.js");
const { ActivityType } = require("discord.js");
const deploySlashCommands = require("../../utils/deploySlashCommands");

module.exports = {
  name: "ready",
  run: async (client) => {
    const owner = client.users.cache.get(client.owner);
    const user = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    client.logger.log(`${client.user.username} online!`, "ready");
    client.logger.log(
      `Ready on ${client.guilds.cache.size} servers, for a total of ${user} users`,
      "ready",
    );

    // Load slash commands
    console.log("Loading slash commands...");
    const slashCommandsPath = require("path").join(__dirname, "../../slashCommands");
    const fs = require("fs");
    const data = [];
    let totalCommands = 0;

    fs.readdirSync(slashCommandsPath).forEach((dir) => {
      const slashCommandFiles = fs
        .readdirSync(require("path").join(slashCommandsPath, dir))
        .filter((file) => file.endsWith(".js"));
      for (const file of slashCommandFiles) {
        const slashCommand = require(require("path").join(slashCommandsPath, dir, file));
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

    client.slashCommandData = data;
    console.log(`Loaded ${totalCommands} slash commands into memory`);
    client.logger.log(`Slash Commands Loaded: ${totalCommands}`, "cmd");

    // Deploy slash commands to Discord
    console.log("Deploying slash commands to Discord...");
    await deploySlashCommands(client);

    const statuses = [
      ">help | >play",
      "Astrix Development <3",
      "Trusted By " + client.numb(user) + " Users",
      client.config.links.vanity,
    ];
    setInterval(function () {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status, { type: ActivityType.Listening });
    }, 10000);
  },
};