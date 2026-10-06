const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "texttoemoji",
  category: "Fun",
  aliases: ["texttoemoji", "tte"],
  cooldown: 3,
  description: "Converts text to emojis.",
  args: true,
  usage: "<text>",
  userPerms: [],
  owner: false,
  voteonly: false,
  execute: async (message, args, client, prefix) => {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide some text to convert to emojis.");
    }
    const emojified = client.util.emojify(text);
    message.reply(emojified);
  },
};
