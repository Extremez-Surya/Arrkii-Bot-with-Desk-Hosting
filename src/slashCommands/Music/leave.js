const {
  EmbedBuilder,
  MessageFlags,
  CommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  name: "leave",
  description: "Leave voice channel",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  dj: true,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const player = client.manager.players.get(interaction.guild.id);

    const emojiLeave = interaction.client.emoji.leave;

    await player.destroy();

    const thing = new EmbedBuilder()
      .setColor(interaction.client.color)
      .setDescription(`${emojiLeave} **Leaved the voice channel**`);
    return interaction.editReply({ embeds: [thing] });
  },
};
