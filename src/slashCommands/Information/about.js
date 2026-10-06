/** @format */

const {
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  version,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  name: "about",
  description: "See information about Astrix.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: false });

      const uptime = Math.round((Date.now() - client.uptime) / 1000);
      const guildCount = client.numb(client.guilds.cache.size);
      const channelCount = client.numb(client.channels.cache.size);
      const userCount = client.numb(
        client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0)
      );

      const makeRow = (active = "home") =>
        new ActionRowBuilder().addComponents([
          new ButtonBuilder().setCustomId("astrix").setLabel("Home").setStyle(ButtonStyle.Secondary).setDisabled(active === "home"),
          new ButtonBuilder().setCustomId("inf").setLabel("Info").setStyle(ButtonStyle.Secondary).setDisabled(active === "inf"),
          new ButtonBuilder().setCustomId("od").setLabel("Team").setStyle(ButtonStyle.Secondary).setDisabled(active === "od"),
        ]);

      const makeHomePayload = () => {
        const c = new client.container(0x2b2d31);
        c.text(
          `### 🪐 About Astrix\n` +
          `> A modern, minimal, aesthetic and high-performance Discord music bot.\n` +
          `> \n` +
          `> • **[Official Website](https://astrix.netlify.app)**\n` +
          `> • **[Support Server](${client.config.links.support})**\n` +
          `> • **[Invite Astrix](${client.config.links.invite})**\n` +
          `> \n` +
          `> -# Click the buttons below to view info and developers!`
        );
        c.separator(true);
        c.addRow(makeRow("home"));
        return c.toPayload();
      };

      const makeInfoPayload = () => {
        const c = new client.container(0x2b2d31);
        c.text(
          `### ℹ️ Bot Overview\n` +
          `> • **Name:** \`${client.user.username}\`\n` +
          `> • **Servers:** \`${guildCount}\` • **Users:** \`${userCount}\`\n` +
          `> • **Channels:** \`${channelCount}\` • **Commands:** \`${client.commands.size}\`\n` +
          `> • **Discord.js:** \`v${version}\` • **Ping:** \`${client.ws.ping}ms\`\n` +
          `> • **Uptime:** <t:${uptime}:R>\n` +
          `> \n` +
          `> -# Astrix • Performance & Quality`
        );
        c.separator(true);
        c.addRow(makeRow("inf"));
        return c.toPayload();
      };

      const makeTeamPayload = () => {
        const c = new client.container(0x2b2d31);
        c.text(
          `### 👥 Astrix Team\n` +
          `> • **Developer & Owner:** [Extremez-Surya](https://discord.com/users/984409270344908872)\n` +
          `> \n` +
          `> -# Powered By Astrix Development 🌙`
        );
        c.separator(true);
        c.addRow(makeRow("od"));
        return c.toPayload();
      };

      let initialMsg = null;
      try {
        initialMsg = await interaction.editReply(makeHomePayload());
      } catch {
        initialMsg = await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#2b2d31")
              .setDescription(
                `### 🪐 About Astrix\n> A modern minimal music bot.\n> • [Website](https://astrix.netlify.app) • [Support](${client.config.links.support})`
              ),
          ],
          components: [makeRow("home")],
        });
      }

      if (!initialMsg) return;

      const collector = initialMsg.createMessageComponentCollector({
        filter: (i) => {
          if (i.user.id === interaction.user.id) return true;
          i.reply({
            content: `> ${client.emoji.cross || "❌"} **That's not your session.**`,
            ephemeral: true,
          }).catch(() => {});
          return false;
        },
        time: 60000,
      });

      collector.on("collect", async (i) => {
        try {
          if (i.customId === "astrix") {
            await i.update(makeHomePayload());
          } else if (i.customId === "inf") {
            await i.update(makeInfoPayload());
          } else if (i.customId === "od") {
            await i.update(makeTeamPayload());
          }
        } catch (err) {
          // ignore update errors
        }
      });

      collector.on("end", async () => {
        interaction.editReply({ components: [] }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
    }
  },
};
