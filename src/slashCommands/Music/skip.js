const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  description: "To skip a song/track from the queue.",
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String} color
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const player = client.manager.players.get(interaction.guild.id);

    if (player.queue.length == 0) {
      const noskip = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`No more songs left in the queue to skip.`);
      return interaction.editReply({ embeds: [noskip] });
    }

    player.skip();

    const emojiskip = client.emoji.skip;

    const thing = new EmbedBuilder()
      .setDescription(
        `${emojiskip} **Skipped**\n[${player.queue.current.title}](${client.config.links.support})`,
      )
      .setColor(client.color);
    return interaction.editReply({ embeds: [thing] });
  },
};
