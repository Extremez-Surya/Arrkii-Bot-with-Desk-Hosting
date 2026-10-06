const {
  EmbedBuilder,
  MessageFlags,
  CommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "Shuffle queue",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  dj: true,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const player = client.manager.players.get(interaction.guild.id);

    const emojishuffle = client.emoji.shuffle;

    const thing = new EmbedBuilder()
      .setDescription(`${emojishuffle} Shuffled the queue`)
      .setColor(client.color);
    await player.queue.shuffle();
    return interaction
      .editReply({ embeds: [thing] })
      .catch((error) => client.logger.log(error, "error"));
  },
};
