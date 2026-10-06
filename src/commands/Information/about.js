/** @format */

const {
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  version,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "about",
  category: "Information",
  aliases: ["dev", "abt"],
  botPrams: ["EMBED_LINKS"],
  description: "See information about this project.",
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    try {
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
        initialMsg = await message.reply(makeHomePayload());
      } catch {
        initialMsg = await message.reply({
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
        filter: (interaction) => {
          if (interaction.user.id === message.author.id) return true;
          interaction.reply({
            content: `> ${client.emoji.cross || "❌"} **That's not your session.** Run \`${prefix}about\` to open your own.`,
            ephemeral: true,
          }).catch(() => {});
          return false;
        },
        time: 60000,
      });

      collector.on("collect", async (interaction) => {
        try {
          if (interaction.customId === "astrix") {
            await interaction.update(makeHomePayload());
          } else if (interaction.customId === "inf") {
            await interaction.update(makeInfoPayload());
          } else if (interaction.customId === "od") {
            await interaction.update(makeTeamPayload());
          }
        } catch (err) {
          // ignore update errors
        }
      });

      collector.on("end", async () => {
        initialMsg.edit({ components: [] }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
    }
  },
};
