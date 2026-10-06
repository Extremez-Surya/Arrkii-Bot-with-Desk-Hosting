const { EmbedBuilder } = require("discord.js");
const db2 = require("../../schema/247");
const { autoplay } = require("../../utils/functions");
const axios = require("axios");

module.exports = {
  name: "playerEmpty",
  run: async (client, player) => {
    player.data
      .get("message")
      ?.delete()
      .catch(() => null);

    if (player.data.get("autoplay")) {
      player.previous = player.data.get("autoplaySystem");
      return autoplay(player);
    }
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;

    const TwoFourSeven = await db2.findOne({ Guild: player.guildId });

    const bar = TwoFourSeven ? client.emoji.tick : client.emoji.cross;

    if (TwoFourSeven) {
      client.rest
        .put(`/channels/${player.voiceId}/voice-status`, {
          body: { status: `Type: ${client.prefix}p [song]` },
        })
        .catch(() => null);
      client.channels.cache.get(player.textId)?.send({
        embeds: [
          new client.embed()
            .setAuthor({
              name: `No more songs left to play`,
              iconURL: guild.iconURL(),
            })
            .d(
              `> ___247: ${bar}___\n> ___Enjoying Music with me ?___\n> [___Consider Joining my Support server___](${client.config.links.support})`,
            )
            .setTimestamp(),
        ],
      }).catch(() => null);;
    } else if (!TwoFourSeven) {
      client.rest
        .put(`/channels/${player.voiceId}/voice-status`, {
          body: { status: `Type: ${client.prefix}p [song]` },
        })
        .catch(() => null);
      client.channels.cache.get(player.textId)?.send({
        embeds: [
          new client.embed()
            .setAuthor({
              name: `No more songs left to play`,
              iconURL: guild.iconURL(),
            })
            .d(
              `> ___247: ${bar}___\n> ___Enjoying Music with me ?___\n> [___Consider Joining my Support server___](${client.config.links.support})`,
            )
            .setTimestamp(),
        ],
      }).catch(() => null);;
    }
  },
};
