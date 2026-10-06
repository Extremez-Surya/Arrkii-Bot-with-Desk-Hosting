const {
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const _ = require("lodash");

module.exports = {
  name: "queue",
  category: "Music",
  aliases: ["q"],
  cooldown: 3,
  description: "Show the music queue and now playing track.",
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
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> No song is currently playing in this server.`
      );
      return c.reply(message);
    }

    const current = player.queue.current;
    const currentLine = `> 🎵 **Now Playing:** [${current.title.substring(0, 35)}](${current.uri || client.config.links.support}) \`[${convertTime(current.length)}]\``;

    const upcoming = player.queue.map((t, i) =>
      `> \`${i + 1}.\` [${t.title.substring(0, 32)}](${t.uri || client.config.links.support}) • \`${convertTime(t.length)}\``
    );

    const fullItems = upcoming.length > 0 ? upcoming : ["> *No upcoming tracks in queue.*"];
    const chunks = _.chunk(fullItems, 8);
    let page = 0;

    const makeRow = (currentPage, totalPages) =>
      new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId("q_prev").setEmoji("⬅️").setStyle(ButtonStyle.Secondary).setDisabled(currentPage === 0),
        new ButtonBuilder().setCustomId("q_page").setLabel(`${currentPage + 1}/${totalPages}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId("q_next").setEmoji("➡️").setStyle(ButtonStyle.Secondary).setDisabled(currentPage >= totalPages - 1),
      ]);

    const makePayload = (p) => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 📜 Server Music Queue\n` +
        `${currentLine}\n` +
        `> \n` +
        `> **Upcoming Tracks (${player.queue.length}):**\n` +
        `${chunks[p].join("\n")}\n` +
        `> \n` +
        `> -# Loop: ${player.loop || "off"} • Autoplay: ${player.data.get("autoplay") ? "on" : "off"}`
      );
      if (chunks.length > 1) {
        c.separator(true);
        c.addRow(makeRow(p, chunks.length));
      }
      return c.toPayload();
    };

    let msg = null;
    try {
      msg = await message.channel.send(makePayload(page));
    } catch {
      msg = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(
              `### 📜 Server Music Queue\n${currentLine}\n\n**Upcoming Tracks:**\n${chunks[page].join("\n")}`
            ),
        ],
        components: chunks.length > 1 ? [makeRow(page, chunks.length)] : [],
      });
    }

    if (chunks.length <= 1 || !msg) return;

    const collector = msg.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id === message.author.id) return true;
        b.reply({
          content: `> ${client.emoji.cross || "❌"} **That's not your session.**`,
          ephemeral: true,
        }).catch(() => {});
        return false;
      },
      time: 120_000,
    });

    collector.on("collect", async (b) => {
      try {
        if (b.customId === "q_next") {
          page = Math.min(page + 1, chunks.length - 1);
        } else if (b.customId === "q_prev") {
          page = Math.max(page - 1, 0);
        }
        await b.update(makePayload(page));
      } catch (err) {
        // ignore
      }
    });

    collector.on("end", async () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
