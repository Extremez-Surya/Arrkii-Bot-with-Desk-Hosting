const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nitro",
  description: "Generate a fake nitro gift link",
  category: "Fun",
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    message.channel.send(
      "free nitro:D \nhttps://discord.gift/pnQQ9KxKuMqT2KNxHuKANhvc",
    );
  },
};
