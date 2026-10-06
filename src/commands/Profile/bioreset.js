const { EmbedBuilder } = require("discord.js");
const Profile = require("../../schema/profile");

module.exports = {
  name: "bioreset",
  aliases: ["about-"],
  category: "Profile",
  cooldown: 3,
  description: "Reset your profile status.",
  args: false,
  usage: "",
  owner: false,
  execute: async (message, args, client, prefix, player, guildData) => {
    const userProfile = await Profile.findOne({ User: message.author.id });
    if (!userProfile) {
      return message.channel.send(`You didn't set your About yet`);
    } else {
      const newProfile = Profile.findOne({ User: message.author.id });
      await newProfile.deleteMany();
      return message.reply("Successfully reset your profile status.");
    }
  },
};
