const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { progressbar } = require("../../utils/progressbar.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  description: "Show now playing song",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.queue.current) {
      const container = new client.container(0x2b2d31)
        .text(`### ⚠️ Nothing Playing\n> There is no song currently playing in this server.`);
      return container.reply(message);
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
      return await message.channel.send({
        components: [container.build()],
        flags: MessageFlags.IsComponentsV2,
      });
    } catch {
      return await message.channel.send({
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
