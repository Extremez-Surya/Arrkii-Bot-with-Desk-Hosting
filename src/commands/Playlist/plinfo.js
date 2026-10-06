/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const db = require("../../schema/playlist");
const { convertTime } = require("../../utils/convert.js");
const lodash = require("lodash");

module.exports = {
  name: "plinfo",
  aliases: ["plinfo"],
  cooldown: 3,
  category: "Playlist",
  description: "Get information about your saved playlist.",
  args: true,
  usage: "Please Enter The Playlist Name",
  userPerms: [],
  owner: false,
  player: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const Name = args[0].replace(/_/g, " ");
    const data = await db.findOne({
      UserId: message.author.id,
      PlaylistName: Name,
    });

    if (!data) {
      return message.reply({
        embeds: [
          new client.embed()
            .setColor(client.embedColor)
            .setDescription(`You don't have a playlist called **${Name}**.`),
        ],
      });
    }

    const tracks = data.Playlist.map(
      (x, i) =>
        `\`${i}\` - ${
          x.title && x.uri ? `[${x.title}](${x.uri})` : `${x.title}`
        }${x.duration ? ` - \`${convertTime(Number(x.duration))}\`` : ""}`,
    );
    const pages = lodash.chunk(tracks, 10).map((x) => x.join("\n"));
    let page = 0;

    const pname = data.PlaylistName;
    const plist = data.Playlist.length;

    const embed = new client.embed()
      .setAuthor({
        name: `| ${message.author.username}'s Playlist Info`,
        iconURL: message.member.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `**Name:** \`${pname}\` \n**Tracks:** \`${plist}\`\n\n${pages[page]}`,
      );

    if (pages.length <= 1) {
      return await message.reply({ embeds: [embed] });
    } else {
      const previousbut = new ButtonBuilder()
        .setCustomId("Previous")
        .setEmoji(client.emoji.left || "⬅️")
        .setStyle(ButtonStyle.Secondary);

      const nextbut = new ButtonBuilder()
        .setCustomId("Next")
        .setEmoji(client.emoji.right || "➡️")
        .setStyle(ButtonStyle.Secondary);

      const stopbut = new ButtonBuilder()
        .setCustomId("Stop")
        .setEmoji(client.emoji.delete || "🗑️")
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(
        previousbut,
        nextbut,
        stopbut,
      );

      const m = await message.reply({ embeds: [embed], components: [row] });

      const collector = m.createMessageComponentCollector({
        filter: (b) => {
          if (b.user.id !== message.author.id) {
            b.reply({
              content: "This is not your session!",
              ephemeral: true,
            });
            return false;
          }
          return true;
        },
        time: 60000 * 5,
        idle: (60000 * 5) / 2,
      });

      collector.on("end", async () => {
        if (!m) return;
        await m.edit({
          components: [
            new ActionRowBuilder().addComponents(
              previousbut.setDisabled(true),
              stopbut.setDisabled(true),
              nextbut.setDisabled(true),
            ),
          ],
        }).catch(() => {});
      });

      collector.on("collect", async (b) => {
        if (!b.deferred) await b.deferUpdate().catch(() => {});

        if (b.customId === "Previous") {
          page = page - 1 < 0 ? pages.length - 1 : --page;
        } else if (b.customId === "Next") {
          page = page + 1 >= pages.length ? 0 : ++page;
        } else if (b.customId === "Stop") {
          return collector.stop();
        }

        if (!m) return;

        embed.setDescription(
          `**Name:** \`${pname}\` \n**Tracks:** \`${plist}\`\n\n${pages[page]}`,
        );

        return await m.edit({ embeds: [embed] }).catch(() => {});
      });
    }
  },
};
