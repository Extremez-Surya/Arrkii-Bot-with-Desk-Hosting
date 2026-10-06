const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Know My Uptime",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false,
    });
    const duration1 = Math.round(
      (Date.now() - interaction.client.uptime) / 1000,
    );
    const embed = new EmbedBuilder()
      .setDescription(
        `${client.emoji.dot} | __My Last Boot Was <t:${duration1}:R>__`,
      )
      .setColor(client.color);
    interaction.editReply({ embeds: [embed] });
  },
};
