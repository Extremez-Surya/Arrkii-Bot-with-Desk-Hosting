const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageFlags,
  ButtonStyle,
} = require("discord.js");
const { KazagumoPlayer } = require("kazagumo");

module.exports = {
  name: "playerCreate",

  /**
   *
   * @param {Client} client
   * @param {KazagumoPlayer} player
   */

  run: async (client, player) => {
    const guild = client.guilds.cache.get(player.guildId);
    const name = guild ? guild.name : "Unknown Guild";
    client.logger.log(`Player Create in ${name} [ ${player.guildId} ]`, "log");
    if (player.voiceId) {
      client.rest
        .put(`/channels/${player.voiceId}/voice-status`, {
          body: { status: `Type: ${client.prefix}p [song]` },
        })
        .catch(() => null);
    }
  },
};
