const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
  name: "pldelete",
  aliases: ["pldelete"],
  cooldown: 3,
  category: "Playlist",
  description: "Delete your saved playlist.",
  args: false,
  usage: "playlist name to delete playlist.",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  player: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const Name = args[0];
    const data = await db.findOne({
      UserId: message.author.id,
      PlaylistName: Name,
    });
    if (!data) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("2f3136")
            .setDescription(
              `${client.emoji.cross} | You don't have a playlist with **${Name}** name`,
            ),
        ],
      });
    }
    if (data.length == 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("2f3136")
            .setDescription(
              `${client.emoji.cross} | You don't have a playlist with **${Name}** name`,
            ),
        ],
      });
    }
    await data.delete();
    const embed = new EmbedBuilder()
      .setColor("2f3136")
      .setDescription(
        `${client.emoji.delete} | Successfully deleted ${Name} playlist`,
      );
    return message.channel.send({ embeds: [embed] });
  },
};
