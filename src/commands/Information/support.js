const {
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "support",
  category: "Information",
  aliases: [],
  description: "Gives you the link of our support server",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    const embed = new EmbedBuilder()
      .setDescription(`[Click Me](${client.config.links.support})`)
      .setColor(client.color);
    await message.reply({ embeds: [embed] });
  },
};
