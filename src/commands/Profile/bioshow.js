/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const { MessageFlags } = require("discord.js");
const Profile = require("../../schema/profile");

module.exports = {
  name: "bioshow",
  category: "Profile",
  cooldown: 3,
  description: "Show your profile.",
  execute: async (message, args, client, prefix, player, guildData) => {
    const user = message.mentions.users.first() || message.author;
    const userProfile = await Profile.findOne({ User: user.id });

    if (!userProfile) {
      const embed = new client.embed().setColor("2f3136").setAuthor({
        name: `You Didn't Create Yet`,
        iconURL: message.author.displayAvatarURL(),
        url: client.config.links.vote,
      });
      // .setDescription(`___${client.emoji.dot} | You Didn't Create Yet___`);

      return message.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } else {
      const embed = new client.embed()
        .setColor("2f3136")
        .addFields({ name: "Status:", value: `\`${userProfile.Status}\`` });

      return message.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  },
};
