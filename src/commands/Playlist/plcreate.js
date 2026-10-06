const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");

module.exports = {
  name: "plcreate",
  aliases: ["plcreate"],
  category: "Playlist",
  cooldown: 3,
  description: "Creates the user's playlist.",
  args: true,
  usage: "playlist name to create playlist.",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const Name = args[0];
    if (Name.length > 10) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("2f3136")
            .setDescription(
              "${client.emoji.cross} | Playlist Name Cant Be Greater Than `10` Charecters",
            ),
        ],
      });
    }
    const data = await db.find({
      UserId: message.author.id,
      PlaylistName: Name,
    });

    if (data.length > 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("2f3136")
            .setDescription(
              `${client.emoji.cross} | This playlist already Exists! delete it using: \`${prefix}\`delete \`${Name}\``,
            ),
        ],
      });
    }
    const userData = db.find({
      UserId: message.author.id,
    });
    if (userData.length >= 10) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("2f3136")
            .setDescription(
              `${client.emoji.cross} | You Can Only Create \`10\` Playlist`,
            ),
        ],
      });
    }

    const newData = new db({
      UserName: message.author.tag,
      UserId: message.author.id,
      PlaylistName: Name,
      CreatedOn: Math.round(Date.now() / 1000),
    });
    await newData.save();
    const embed = new EmbedBuilder()
      .setDescription(
        `${client.emoji.tick} | Successfully created a playlist for you **${Name}**`,
      )
      .setColor("2f3136");
    return message.channel.send({ embeds: [embed] });
  },
};
