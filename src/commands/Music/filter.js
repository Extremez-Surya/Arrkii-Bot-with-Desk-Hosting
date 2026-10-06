/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const {
  MessageFlags,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "filter",
  category: "Music",
  aliases: ["eq", "filters"],
  cooldown: 3,
  description: "Sets the bot's sound filter.",
  args: false,
  usage: "",
  userPerms: [],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    if (!player || !player.queue.current) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before applying audio filters.`
      );
      return c.reply(message);
    }

    const row4 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("disable_h")
        .setPlaceholder(`Choose an audio filter...`)
        .addOptions([
          { label: "Reset Filters", value: "clear", emoji: "🔄" },
          { label: "BassBoost", value: "bass_but", emoji: "🔊" },
          { label: "8D Audio", value: "8d_but", emoji: "🎧" },
          { label: "Nightcore", value: "night_but", emoji: "🌙" },
          { label: "Pitch", value: "pitch_but", emoji: "⚡" },
          { label: "Distort", value: "distort_but", emoji: "💥" },
          { label: "Equalizer", value: "eq_but", emoji: "🎛️" },
          { label: "Speed", value: "speed_but", emoji: "⏩" },
          { label: "Vaporwave", value: "vapo_but", emoji: "🌊" },
        ])
    );

    const container = new client.container(0x2b2d31)
      .text(
        `### 🎛️ Audio Equalizer & Filters\n` +
        `> Select an audio enhancement filter from the menu below.\n` +
        `> \n` +
        `> -# Active Track: [${player.queue.current.title.substring(0, 30)}](${player.queue.current.uri || client.config.links.support})`
      )
      .separator(true)
      .addRow(row4);

    let eq = null;
    try {
      eq = await message.reply(container.toPayload());
    } catch {
      eq = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(`### 🎛️ Audio Filters\n> Select a filter from the menu below.`),
        ],
        components: [row4],
      });
    }

    const collector = await eq.createMessageComponentCollector({
      filter: (i) => {
        if (message.author.id === i.user.id) return true;
        else {
          i.reply({
            content: `${client.emoji.cross} | That's not your session run : \`${prefix}filter\` to create your own.`,
            ephemeral: true,
          });
        }
      },
      time: 100000,
    });

    collector.on("collect", async (i) => {
      if (i.isStringSelectMenu()) {
        for (const value of i.values) {
          if (value === "clear") {
            player.shoukaku.clearFilters();
            return i.reply({
              content: `${client.emoji.tick} Succesfully Cleared All **FILTERS**`,
              flags: MessageFlags.Ephemeral,
            });
          }
          if (value === "bass_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 0, gain: 0.1 },
                { band: 1, gain: 0.1 },
                { band: 2, gain: 0.05 },
                { band: 3, gain: 0.05 },
                { band: 4, gain: -0.05 },
                { band: 5, gain: -0.05 },
                { band: 6, gain: 0 },
                { band: 7, gain: -0.05 },
                { band: 8, gain: -0.05 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.05 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.1 },
                { band: 13, gain: 0.1 },
              ],
            });
            await i.reply({
              flags: MessageFlags.Ephemeral,
              content: `${client.emoji.tick} BassBoost mode **ENABLED**`,
            });
          }
          if (value === "8d_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              rotation: { rotationHz: 0.2 },
            });
            await i.reply({
              ephemeral: false,
              content: `${client.emoji.tick} 8D Mode **ENABLED**`,
              flags: MessageFlags.Ephemeral,
            });
          }
          if (value === "night_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 1, gain: 0.3 },
                { band: 0, gain: 0.3 },
              ],
              timescale: { pitch: 1.2 },
              tremolo: { depth: 0.3, frequency: 14 },
            });
            i.reply({
              content: `${client.emoji.tick} NightCore Mode **ENABLED**`,
              flags: MessageFlags.Ephemeral,
            });
          }
          if (value === "pitch_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              timescale: {
                pitch: 1.245,
                rate: 1.921,
              },
            });
            i.reply({
              content: `${client.emoji.tick} Pitch Mode **ENABLED**`,
              flags: MessageFlags.Ephemeral,
            });
          }
          if (value === "distort_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 0, gain: 0.5 }, // Boosting lower frequencies significantly
                { band: 1, gain: 0.5 },
                { band: 2, gain: 0.3 },
                { band: 3, gain: 0.3 },
                { band: 4, gain: 0.2 },
                { band: 5, gain: 0.2 },
                { band: 6, gain: 0.1 },
                { band: 7, gain: 0.1 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: -0.1 }, // Slightly reducing some higher frequencies
                { band: 11, gain: -0.1 },
                { band: 12, gain: -0.2 },
                { band: 13, gain: -0.2 },
              ],
            });

            i.reply({
              flags: MessageFlags.Ephemeral,
              content: `${client.emoji.tick} Distort Mode **ENABLED**`,
            });
          }
          if (value === "speed_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              timescale: {
                speed: 1.501,
                pitch: 1.245,
                rate: 1.921,
              },
            });
            i.reply({
              flags: MessageFlags.Ephemeral,
              content: `${client.emoji.tick} Speed Mode **ENABLED**`,
            });
          }
          if (value === "vapo_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 1, gain: 0.3 },
                { band: 0, gain: 0.3 },
              ],
              timescale: { pitch: 0.5 },
              tremolo: { depth: 0.3, frequency: 14 },
            });
            i.reply({
              flags: MessageFlags.Ephemeral,
              content: `${client.emoji.tick} VaporWave Mode **ENABLED**`,
            });
          }
          if (value === "lofi_but") {
            await player.shoukaku.setFilters({
              op: "filters",
              guildId: message.guild.id,
              equalizer: [
                { band: 0, gain: -0.25 },
                { band: 1, gain: -0.25 },
                { band: 2, gain: -0.15 },
                { band: 3, gain: -0.1 },
                { band: 4, gain: -0.05 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0.05 },
                { band: 10, gain: 0.1 },
                { band: 11, gain: 0.15 },
                { band: 12, gain: 0.2 },
                { band: 13, gain: 0.25 },
              ],
            });

            i.reply({
              flags: MessageFlags.Ephemeral,
              content: `${client.emoji.tick} Lofi Mode **ENABLED**`,
            });
          }
        }
      }
    });
  },
};
