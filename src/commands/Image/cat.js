const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "cat",
  category: "Image",
  aliases: ["pussy", "cat", "pat"],
  cooldown: 3,
  description: "Sends a random dog pic",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
   try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();

      console.log("API Response:", data); // DEBUG

      if (!data || !data[0] || !data[0].url) {
        return message.channel.send("❌ Could not get a cat image right now.");
      }

      const img = data[0].url;

      const embed = new EmbedBuilder()
        .setTitle("🐈 Cat 🐈")
        .setImage(img)
        .setColor(client.color)
        .setFooter({
          text: "Requested by " + message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Fetch error:", err);
      message.channel.send("❌ Couldn't fetch a cat image at the moment.");
    }
  },
};