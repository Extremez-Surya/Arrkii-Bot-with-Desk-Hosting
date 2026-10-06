const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/playlist");
const lodash = require("lodash");

module.exports = {
  name: "pllist",
  aliases: ["pllist"],
  category: "Playlist",
  description: "List your created playlists.",
  args: false,
  usage: "list",
  userPerms: [],
  owner: false,
  player: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const data = await db.find({ UserId: message.author.id });
    if (!data.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`You Haven't Created Any Playlist To Show`),
        ],
      });
    }
    if (!args[0]) {
      const list = data.map(
        (x, i) =>
          `\`${++i}\` - **${x.PlaylistName}** \`${x.Playlist.length} Song(s)\` - <t:${x.CreatedOn}:R>`,
      );
      const pages = lodash.chunk(list, 10).map((x) => x.join("\n"));
      const page = 0;
      const List = list.length;

      const embeds = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username}'s Playlists`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(pages[page])
        .setFooter({ text: `Playlist (${List} / 10)` })
        .setColor(client.embedColor)
        .setThumbnail(client.user.displayAvatarURL());
      return await message.channel.send({ embeds: [embeds] });
    }
  },
};
