const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedBuilder,
  CommandInteraction,
  Client,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { progressbar } = require("../../utils/progressbar.js");

module.exports = {
  name: "nowplaying",
  description: "Show now playing song",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
    const player = client.manager.players.get(interaction.guild.id);

    if (!player || !player.queue.current) {
      const container = new client.container(0x2b2d31)
        .text(`### ⚠️ Nothing Playing\n> There is no song currently playing in this server.`);
      return interaction.editReply(container.toPayload());
    }

    const song = player.queue.current;
    const req = song.requester;
    const auth = song.author || "Unknown Artist";
    const total = song.length;
    const current = player.position;
    const reqId = req?.id || req;

    let pBar = "──⚪─────────────";
    try {
      pBar = progressbar(player) || "──⚪─────────────";
    } catch {
      pBar = "──⚪─────────────";
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("pause")
        .setEmoji(player.paused ? (client.emoji.play || "▶️") : (client.emoji.pause || "⏸️"))
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji(client.emoji.skip || "⏭️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji(client.emoji.stop || "⏹️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji(client.emoji.loop || "🔁")
        .setStyle(ButtonStyle.Secondary)
    );

    const container = new client.container(0x2b2d31)
      .text(
        `### 🎵 Now Playing\n` +
        `> **[${song.title}](${song.uri || client.config.links.support})**\n` +
        `> ⏱️ \`${convertTime(current)} / ${convertTime(total)}\` • 👤 \`${auth}\`\n` +
        `> 🎧 Requested by <@${reqId}>\n` +
        `> \n` +
        `> \`${pBar}\`\n` +
        `> \n` +
        `> -# Astrix Music • Minimal & Fast`
      )
      .separator(true)
      .addRow(row);

    try {
      return await interaction.editReply(container.toPayload());
    } catch {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(
              `### 🎵 Now Playing\n` +
              `> **[${song.title}](${song.uri || client.config.links.support})**\n` +
              `> ⏱️ \`${convertTime(current)} / ${convertTime(total)}\` • 👤 \`${auth}\`\n` +
              `> 🎧 Requested by <@${reqId}>\n` +
              `> \n` +
              `> \`${pBar}\`\n` +
              `> \n` +
              `> -# Astrix Music • Minimal & Fast`
            ),
        ],
        components: [row],
      });
    }
  },
};
