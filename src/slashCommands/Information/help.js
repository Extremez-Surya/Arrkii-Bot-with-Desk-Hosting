const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Help with all commands or browse categories.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });

    const commandCategories = [
      { label: "Antinuke", value: "antinuke", description: "Antinuke security commands", emoji: "🛡️" },
      { label: "Automod", value: "automod", description: "Automoderation commands", emoji: "🤖" },
      { label: "Config", value: "config", description: "Server configuration", emoji: "⚙️" },
      { label: "Extra", value: "extra", description: "Extra utilities", emoji: "✨" },
      { label: "Fun", value: "fun", description: "Fun & entertainment", emoji: "🎮" },
      { label: "Information", value: "information", description: "General info & stats", emoji: "ℹ️" },
      { label: "Moderation", value: "moderation", description: "Server moderation", emoji: "🔨" },
      { label: "Music", value: "music", description: "Music playback & controls", emoji: "🎵" },
      { label: "Pfps", value: "pfps", description: "Profile pictures & banners", emoji: "🖼️" },
      { label: "Playlist", value: "playlist", description: "Custom music playlists", emoji: "💿" },
      { label: "Profile", value: "profile", description: "User profiles & bios", emoji: "👤" },
      { label: "Role", value: "role", description: "Special role management", emoji: "🎭" },
      { label: "Utility", value: "utility", description: "Server utilities & tools", emoji: "🛠️" },
      { label: "Voice", value: "voice", description: "Voice channel controls", emoji: "🔊" },
      { label: "Welcome", value: "welcome", description: "Welcome greeting system", emoji: "👋" },
    ];

    const dropdown = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_select")
        .setPlaceholder("Choose a category to browse...")
        .addOptions(commandCategories)
    );

    const homeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("help_home").setLabel("Overview").setEmoji("🏠").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setLabel("Support").setStyle(ButtonStyle.Link).setURL(client.config.links.support),
      new ButtonBuilder().setLabel("Invite").setStyle(ButtonStyle.Link).setURL(client.config.links.invite)
    );

    const makeMainPayload = () => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 📚 Astrix Commands Directory\n` +
        `> Select a category below to view all available commands.\n` +
        `> \n` +
        `> • **Prefix:** \`${client.prefix}\` • **Ping:** \`${client.ws.ping}ms\`\n` +
        `> • **Prefix Commands:** \`${client.commands.size}\` • **Slash Commands:** \`${client.slashCommands.size}\`\n` +
        `> \n` +
        `> -# Astrix • Minimal, Clean & Fast`
      );
      c.separator(true);
      c.addRow(dropdown);
      c.addRow(homeButton);
      return c.toPayload();
    };

    const makeCategoryPayload = (cat) => {
      const cmds = client.commands
        .filter((cmd) => cmd.category?.toLowerCase() === cat.toLowerCase())
        .map((cmd) => `\`${cmd.name}\``);

      const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
      const c = new client.container(0x2b2d31);
      c.text(
        `### 🏷️ ${catName} Commands\n` +
        `> ${cmds.join(", ") || "No commands found in this module."}\n` +
        `> \n` +
        `> -# Showing ${cmds.length} commands`
      );
      c.separator(true);
      c.addRow(dropdown);
      c.addRow(homeButton);
      return c.toPayload();
    };

    let sentMsg = null;
    try {
      sentMsg = await interaction.editReply(makeMainPayload());
    } catch {
      sentMsg = await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(`### 📚 Astrix Commands\n> Select a category below.`),
        ],
        components: [dropdown, homeButton],
      });
    }

    if (!sentMsg) return;

    const collector = sentMsg.createMessageComponentCollector({
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
        if (i.isButton() && i.customId === "help_home") {
          await i.update(makeMainPayload());
        } else if (i.isStringSelectMenu() && i.customId === "help_select") {
          await i.update(makeCategoryPayload(i.values[0]));
        }
      } catch (err) {
        // ignore update errors
      }
    });

    collector.on("end", async () => {
      interaction.editReply({ components: [] }).catch(() => {});
    });
  },
};
