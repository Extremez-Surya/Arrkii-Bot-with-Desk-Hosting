const {
    ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "vote",
  aliases: ["vote"],
  description: "Vote for the bot",
  args: false,
  botPrams: ["EMBED_LINKS"],
  userPerms: [],
  owner: false,
  category: "Information",
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    const button = new ButtonBuilder()
      .setLabel("Vote")
      .setStyle("Link")
      .setURL("https://top.gg/bot/1033496708992204840/vote");
    const row = new ActionRowBuilder().addComponents(button);
    message.reply({components: [row] });
  },
};
