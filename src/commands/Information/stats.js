/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const {
  MessageFlags,
  version,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "stats",
  category: "Information",
  aliases: ["status", "botinfo", "bi"],
  description: "Displays bot stats.",
  botPrams: ["EmbedLinks"],
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    let guildsCounts = client.guilds.cache.size;
    let TotalChannels = client.channels.cache.size;
    let TotalUsers = client.guilds.cache.reduce(
      (acc, guild) => acc + (guild.memberCount || 0),
      0
    );

    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const duration1 = Math.round((Date.now() - client.uptime) / 1000);

    const makeNavRow = (active = "st") =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("st").setLabel("Statistics").setStyle(ButtonStyle.Secondary).setDisabled(active === "st"),
        new ButtonBuilder().setCustomId("dev").setLabel("Team").setStyle(ButtonStyle.Secondary).setDisabled(active === "dev"),
        new ButtonBuilder().setCustomId("imp").setLabel("Links").setStyle(ButtonStyle.Secondary).setDisabled(active === "imp")
      );

    const makeStatsContainer = () => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 📊 Astrix Statistics\n` +
        `> • **Servers:** \`${client.numb(guildsCounts)}\` • **Users:** \`${client.numb(TotalUsers)}\`\n` +
        `> • **Channels:** \`${client.numb(TotalChannels)}\` • **Commands:** \`${client.numb(client.commands.size)}\`\n` +
        `> • **RAM Usage:** \`${memUsage} MB\` • **Ping:** \`${client.ws.ping}ms\`\n` +
        `> • **Discord.js:** \`v${version}\` • **Uptime:** <t:${duration1}:R>\n` +
        `> \n` +
        `> -# Astrix • Performance & Stability`
      );
      c.separator(true);
      c.addRow(makeNavRow("st"));
      return c.toPayload();
    };

    const makeDevContainer = () => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 👥 Astrix Development Team\n` +
        `> • **Developer & Owner:** [Extremez-Surya](https://discord.com/users/984409270344908872)\n` +
        `> \n` +
        `> -# Powered By Astrix Development 🌙`
      );
      c.separator(true);
      c.addRow(makeNavRow("dev"));
      return c.toPayload();
    };

    const makeLinksContainer = () => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 🔗 Official Astrix Links\n` +
        `> • **[Astrix Support](${client.config.links.support})**\n` +
        `> • **[Astrix Website](https://astrix.netlify.app)**\n` +
        `> • **[Invite Astrix](${client.config.links.invite})**\n` +
        `> • **[Vote on Top.gg](${client.config.links.topgg || "https://top.gg"})**\n` +
        `> \n` +
        `> -# Thank you for using Astrix!`
      );
      c.separator(true);
      c.addRow(makeNavRow("imp"));
      return c.toPayload();
    };

    let msg = null;
    try {
      msg = await message.reply(makeStatsContainer());
    } catch {
      msg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(
              `### 📊 Astrix Statistics\n> • **Servers:** \`${client.numb(guildsCounts)}\` • **Users:** \`${client.numb(TotalUsers)}\`\n> • **RAM:** \`${memUsage} MB\` • **Ping:** \`${client.ws.ping}ms\``
            ),
        ],
        components: [makeNavRow("st")],
      });
    }

    if (!msg) return;

    const collector = msg.createMessageComponentCollector({
      filter: (i) => {
        if (message.author.id === i.user.id) return true;
        i.reply({
          content: `> ${client.emoji.cross || "❌"} **That's not your session.** Run \`${prefix}stats\` to open your own.`,
          ephemeral: true,
        }).catch(() => {});
        return false;
      },
      time: 60000,
    });

    collector.on("collect", async (i) => {
      try {
        if (i.customId === "st") {
          await i.update(makeStatsContainer());
        } else if (i.customId === "dev") {
          await i.update(makeDevContainer());
        } else if (i.customId === "imp") {
          await i.update(makeLinksContainer());
        }
      } catch (err) {
        // ignore update errors
      }
    });

    collector.on("end", async () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
