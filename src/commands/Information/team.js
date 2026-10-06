/** @format
 *
 * Astrix Music Bot
 *
 */

const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "team",
  category: "Information",
  aliases: ["team"],
  description: "See information about the project team.",
  args: false,
  usage: "",
  owner: false,
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    const devId = "984409270344908872";
    let devUser;
    try {
      devUser = await client.users.fetch(devId);
    } catch {
      devUser = {
        id: devId,
        username: "Extremez-Surya",
        displayName: "Extremez-Surya",
        displayAvatarURL: () => client.user.displayAvatarURL({ dynamic: true, size: 2048 }),
      };
    }

    const embedt = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}'s Team`,
        iconURL: client.user.displayAvatarURL({ dynamic: true, size: 2048 }),
      })
      .setDescription(
        `> ***[${message.author.username}](https://discord.com/users/${message.author.id})*** ***Welcome!***\n> ***Astrix is a high-performance, aesthetic Discord music & multi-purpose bot.***\n> ***Select an option below to view detailed developer information.***`,
      )
      .setImage(client.config.links.astrix)
      .setColor(client.color || "#2f3136")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: client.config.links.power || "Powered By Astrix Development 🌙",
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const homeRow = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("home_team")
        .setEmoji("1127607405061079061"),
    ]);

    const selectMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("team_select")
        .setPlaceholder("Astrix Development <3")
        .addOptions([
          {
            label: `${devUser.displayName || devUser.username}`,
            value: `dev_${devUser.id}`,
            description: "Info About My Developer!",
            emoji: "1169971284332003440",
          },
        ]),
    );

    const devEmbed = new EmbedBuilder()
      .setThumbnail(devUser.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setAuthor({
        name: `Info About ${devUser.displayName || devUser.username}`,
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setFooter({
        text: `Thanks For Using Astrix <3`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `> <:Owners:1199282508269879346> **__Developer & Owner__**\n` +
        `> • [@${devUser.displayName || devUser.username}](https://discord.com/users/${devUser.id})\n` +
        `> **ID:** \`-\` ${devUser.id}\n\`\`\`ㅤ\`\`\`\n` +
        `> <:links:1188351754128080957> **__Social Medias ↓__**\n\n` +
        `> <:github:1196715538773180478> __[GitHub](https://github.com/Extremez-Surya)__\n` +
        `> <:config:1127607954561056768> __[Support!](${client.config.links.support})__`,
      )
      .setColor(client.color || "#2f3136")
      .setTimestamp();

    const msg = await message.channel.send({
      embeds: [embedt],
      components: [selectMenu],
    });

    const collector = await msg.createMessageComponentCollector({
      filter: (i) => {
        if (message.author.id === i.user.id) return true;
        i.reply({
          content: `${client.emoji.cross || "❌"} | That's not your session. Run \`${prefix}team\` to create your own.`,
          ephemeral: true,
        });
        return false;
      },
      time: 100000,
    });

    collector.on("collect", async (i) => {
      if (i.isStringSelectMenu()) {
        if (
          i.values.includes(`dev_${devUser.id}`) ||
          i.values.includes(devUser.username) ||
          i.values.includes(devUser.id)
        ) {
          return i.update({ embeds: [devEmbed], components: [selectMenu, homeRow] });
        }
      }
      if (i.isButton()) {
        if (i.customId === "home_team" || i.customId === "1") {
          return i.update({ embeds: [embedt], components: [selectMenu] });
        }
      }
    });

    collector.on("end", async () => {
      if (!msg) return;
      msg.edit({
        embeds: [embedt],
        components: [],
      }).catch(() => {});
    });
  },
};
