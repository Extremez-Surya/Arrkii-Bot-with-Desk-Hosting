const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vcmuteall",
  category: "Voice",
  aliases: ["voicemuteall"],
  description: "Mutes all members in your current voice channel.",
  args: false,
  usage: "",
  userPerms: ["MuteMembers"], // Ensures the user has the necessary permissions
  owner: false,
  execute: async (message, args, client, prefix) => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `<@${message.author.id}> Please join a voice channel first.`,
            ),
        ],
      });
    }

    try {
      const members = voiceChannel.members.filter(
        (member) => !member.permissions.has("MuteMembers"),
      );

      // Check if there are members to mute
      if (members.size === 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `No members found to mute in **${voiceChannel.name}**.`,
              ),
          ],
        });
      }

      // Mute all eligible members
      for (const [memberId, member] of members) {
        await member.voice.setMute(true);
      }

      // Send confirmation message
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `Muted all members in **${voiceChannel.name}** successfully.`,
            ),
        ],
      });
    } catch (err) {
      console.error("Error muting members:", err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription("An error occurred while muting the members."),
        ],
      });
    }
  },
};
