const {
  EmbedBuilder,
  WebhookClient,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ComponentType,
  MessageFlags,
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

const Presets = require("../../schema/preset");
const VcStatus = require("../../schema/vcstatus");
const { musicCard } = require("musicard-quartz");
const { Classic } = require("musicard");
const canvafy = require("canvafy");

const {
  Webhooks: { player_create },
} = require("../../config.js");

// Helper: Button row
const createButtonRow = (paused, client) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(paused ? "resume" : "pause")
      .setEmoji(paused ? (client.emoji.play || "▶️") : (client.emoji.pause || "⏸️"))
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
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("shuffle")
      .setEmoji(client.emoji.shuffle || "🔀")
      .setStyle(ButtonStyle.Secondary)
  );

// Helper: Build minimal Container V2
const makeNowPlayingContainer = (client, title, auth, total, requester, paused = false) => {
  const container = new client.container(0x2b2d31);
  const formattedDur = total ? moment.duration(total).format("hh:mm:ss") : "LIVE";
  const reqId = requester?.id || requester;
  container.text(
    `### 🎵 Now Playing\n` +
    `> **[${title}](${client.config.links.support})**\n` +
    `> ⏱️ \`${formattedDur}\` • 👤 \`${auth}\`\n` +
    `> 🎧 Requested by <@${reqId}>\n` +
    `> \n` +
    `> -# Astrix Music • Minimal & Fast`
  );
  container.separator(true);
  container.addRow(createButtonRow(paused, client));
  return container;
};

// Helper: Send Now Playing message
async function sendNowPlaying(client, player, track, presetType) {
  const channel = client.channels.cache.get(player.textId);
  if (!channel) return;

  const song = player.queue.current;
  const gud = song.title.replace(/(?:hd|full|video|official|4k|8k)/gi, "");
  const title = gud.replace(/[^\p{L}\p{N}\s\u0900-\u097F]/gu, "").replace(/\s+/g, " ").trim();
  const auth = song.author;
  const total = song.length;
  const thumb = song.thumbnail.replace("hqdefault", "maxresdefault");
  const row = createButtonRow(false, client);

  switch (presetType) {
    case 1: {
      const card = new musicCard()
        .setName(auth)
        .setAuthor(title)
        .setColor("auto")
        .setTheme("quartz+")
        .setBrightness(50)
        .setThumbnail(thumb)
        .setProgress(0)
        .setStartTime("0:00")
        .setEndTime(moment.duration(total).format("hh:mm:ss"));
      const attachment = new AttachmentBuilder(await card.build(), { name: "astrix.png" });

      return channel.send({
        embeds: [new EmbedBuilder().setImage("attachment://astrix.png").setColor(client.color)],
        files: [attachment],
        components: [row],
      });
    }

    case 2: {
      const musicard = await Classic({
        thumbnailImage: thumb,
        backgroundColor: "#070707",
        progress: 0,
        progressColor: "#FF7A00",
        progressBarColor: "#5F2D00",
        name: title,
        nameColor: "#FF7A00",
        author: `By ${auth}`,
        authorColor: "#696969",
        startTime: "0:00",
        endTime: moment.duration(total).format("hh:mm:ss"),
        timeColor: "#FF7A00",
      });
      const attachment = new AttachmentBuilder(musicard, { name: "astrix.png" });

      return channel.send({
        embeds: [new EmbedBuilder().setImage("attachment://astrix.png").setColor(client.color)],
        files: [attachment],
        components: [row],
      });
    }

    case 3: {
      const spotify = await new canvafy.Spotify()
        .setAuthor(auth)
        .setTimestamp(1000, total)
        .setImage(thumb)
        .setTitle(title)
        .setBlur(1)
        .setOverlayOpacity(0.5)
        .build();
      const attachment = new AttachmentBuilder(spotify, { name: "astrix.png" });

      return channel.send({
        embeds: [new EmbedBuilder().setImage("attachment://astrix.png").setColor(client.color)],
        files: [attachment],
        components: [row],
      });
    }

    case 4: {
      const letn = Math.round((Date.now() + total) / 1000);
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} Is Playing`, iconURL: track.requester.displayAvatarURL() })
        .setDescription(
          `${client.emoji.playing} [${title}](${client.config.links.support})\n\n> Ends <t:${letn}:R>\n> Author [${auth}](${client.config.links.support})\n> Requester [${track.requester.displayName}](${client.config.links.support})`
        )
        .setImage(client.config.links.image)
        .setColor("#2f3136");

      const eqrow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("disable_h")
          .setPlaceholder("Select Filters")
          .addOptions([
            { label: "Reset Filters", value: "clearbut" },
            { label: "BassBoost", value: "bassbut" },
            { label: "8D", value: "8dbut" },
            { label: "NightCore", value: "nightbut" },
            { label: "Pitch", value: "pitchbut" },
            { label: "Lofi", value: "lofibut" },
            { label: "Distort", value: "distortbut" },
            { label: "Speed", value: "speedbut" },
            { label: "Vaporwave", value: "vapobut" },
          ])
      );

      return channel.send({
        embeds: [embed],
        components: [eqrow, row],
      });
    }

    default: {
      const container = makeNowPlayingContainer(client, title, auth, total, track.requester, false);
      try {
        return await channel.send({
          components: [container.build()],
          flags: MessageFlags.IsComponentsV2,
        });
      } catch (err) {
        return await channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#2b2d31")
              .setDescription(
                `### 🎵 Now Playing\n> **[${title}](${client.config.links.support})**\n> ⏱️ \`${moment.duration(total).format("hh:mm:ss")}\` • 👤 \`${auth}\`\n> 🎧 Requested by <@${track.requester.id || track.requester}>\n> \n> -# Astrix Music • Minimal & Fast`
              ),
          ],
          components: [row],
        });
      }
    }
  }
}

// MAIN HANDLER
module.exports = {
  name: "playerStart",
  run: async (client, player, track) => {
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;

    new WebhookClient({ url: player_create }).send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `Player Started`, iconURL: client.user.displayAvatarURL() })
          .setDescription(`**Server ID:** ${player.guildId}\n**Server Name:** ${guild.name}\n**Req:** ${track.requester}`),
      ],
    });

    const existing = await VcStatus.findOne({ guildId: guild.id });
    const presetDoc = await Presets.findOne({ guildId: guild.id });
    const presetType = presetDoc?.presetType || 0;
    const nplaying = await sendNowPlaying(client, player, track, presetType);
    if (!nplaying) return;

    player.data.set("message", nplaying);

    if (existing) {
      client.rest
        .put(`/channels/${player.voiceId}/voice-status`, {
          body: { status: `${client.emoji.playing} ${track.title.substring(0, 19)}` },
        })
        .catch(() => null);
    }

    const collector = nplaying.createMessageComponentCollector({
      time: track.duration,
      componentType: ComponentType.MessageComponent,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.member.voice.channelId !== player.voiceId) {
        return interaction.reply({
          content: `${client.emoji.cross} | You must be in the same voice channel.`,
          ephemeral: true,
        });
      }

      if (interaction.isButton()) {
        switch (interaction.customId) {
          case "pause":
            player.pause(true);
            try {
              if (nplaying.flags?.has(MessageFlags.IsComponentsV2)) {
                await interaction.update({
                  components: [makeNowPlayingContainer(client, title, auth, total, track.requester, true).build()],
                  flags: MessageFlags.IsComponentsV2,
                });
              } else {
                await interaction.update({ components: [createButtonRow(true, client)] });
              }
            } catch (e) {
              await interaction.update({ components: [createButtonRow(true, client)] }).catch(() => {});
            }
            break;

          case "resume":
            player.pause(false);
            try {
              if (nplaying.flags?.has(MessageFlags.IsComponentsV2)) {
                await interaction.update({
                  components: [makeNowPlayingContainer(client, title, auth, total, track.requester, false).build()],
                  flags: MessageFlags.IsComponentsV2,
                });
              } else {
                await interaction.update({ components: [createButtonRow(false, client)] });
              }
            } catch (e) {
              await interaction.update({ components: [createButtonRow(false, client)] }).catch(() => {});
            }
            break;

          case "skip":
            player.skip();
            await interaction.reply({ content: `> ${client.emoji.skip || "⏭️"} **Skipped the track.**`, ephemeral: true });
            break;

          case "stop":
            player.queue.clear();
            player.data.delete("autoplay");
            player.loop = "none";
            player.playing = false;
            player.paused = false;
            await player.skip();
            await interaction.reply({ content: `> ${client.emoji.stop || "⏹️"} **Playback stopped.**`, ephemeral: true });
            break;

          case "loop":
            player.setLoop(player.loop === "none" ? "track" : "none");
            await interaction.reply({
              content: `> ${client.emoji.replay || "🔁"} **Looping is now ${player.loop === "none" ? "disabled" : "enabled"}.**`,
              ephemeral: true,
            });
            break;

          case "shuffle":
            player.queue.shuffle();
            await interaction.reply({ content: `> ${client.emoji.shuffle || "🔀"} **Queue shuffled.**`, ephemeral: true });
            break;
        }
      } else if (interaction.isStringSelectMenu()) {
        await interaction.deferReply({ ephemeral: true });
        const val = interaction.values[0];

        const filters = {
          clearbut: { op: "filters", guildId: interaction.guild.id },
          bassbut: { op: "filters", guildId: interaction.guild.id, equalizer: Array(14).fill({}).map((_, i) => ({ band: i, gain: i < 2 || i > 11 ? 0.1 : -0.05 })) },
          "8dbut": { op: "filters", guildId: interaction.guild.id, rotation: { rotationHz: 0.2 } },
          nightbut: { op: "filters", guildId: interaction.guild.id, equalizer: [{ band: 1, gain: 0.3 }, { band: 0, gain: 0.3 }], timescale: { pitch: 1.2 }, tremolo: { depth: 0.3, frequency: 14 } },
          pitchbut: { op: "filters", guildId: interaction.guild.id, timescale: { pitch: 1.245, rate: 1.921 } },
          lofibut: { op: "filters", guildId: interaction.guild.id, equalizer: Array(14).fill({}).map((_, i) => ({ band: i, gain: i <= 4 ? -0.25 + i * 0.05 : (i - 5) * 0.05 })) },
          distortbut: { op: "filters", guildId: interaction.guild.id, equalizer: Array(14).fill({}).map((_, i) => ({ band: i, gain: 0.5 - i * 0.05 })) },
          speedbut: { op: "filters", guildId: interaction.guild.id, timescale: { speed: 1.501, pitch: 1.245, rate: 1.921 } },
          vapobut: { op: "filters", guildId: interaction.guild.id, equalizer: [{ band: 1, gain: 0.3 }, { band: 0, gain: 0.3 }], timescale: { pitch: 0.5 }, tremolo: { depth: 0.3, frequency: 14 } },
        };

        if (filters[val]) {
          await player.shoukaku.setFilters(filters[val]);
          await interaction.editReply({ content: `Enabled **${val.replace("but", "")}**.` });
        } else {
          await interaction.editReply({ content: "Unknown filter selected." });
        }
      }
    });
  },
};
