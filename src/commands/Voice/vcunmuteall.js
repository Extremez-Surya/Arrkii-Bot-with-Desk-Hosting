const { EmbedBuilder, MessageFlags, ChannelType } = require("discord.js");

module.exports = {
  name: "vcunmuteall",
  category: "Voice",
  aliases: ["voiceunmute-all"],
  description: "Unmutes all members in the voice channel",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    /**
     * @param {Bot} client
     * @param {Message} message
     * @param {String[]} args
     */

    const voicechannel = message.member.voice.channel;

    if (!voicechannel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              ` <@${message.author.id}> Please join a voice channel first.`,
            ),
        ],
      });
    }

    try {
      // Unmute all members
      voicechannel.members.forEach((member) => {
        if (member.voice.serverMute) {
          member.voice
            .setMute(false)
            .catch((err) =>
              console.error(`Could not unmute ${member.user.tag}:`, err),
            );
        }
      });

      // Send a single confirmation message
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `All members in **${voicechannel.name}** have been unmuted.`,
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `An error occurred while trying to unmute members.`,
            ),
        ],
      });
    }
  },
};
