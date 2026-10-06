/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

module.exports = {
  name: "simprate",
  aliases: ["simp"],
  description: "simp",
  cooldown: 3,
  userPermissions: [],
  botPermissions: [],
  category: "Fun",
  execute: async (message, args, client, prefix) => {
    const Member = message.mentions.members.first() || message.author;

    const Result = Math.floor(Math.random() * 101);
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(
        `**${Member.user.username} Is ${Result}% Simp <:simpers_Eyes_AE:1194607509445550161>**`,
      );

    message.channel.send({ embeds: [embed] });
  },
};
