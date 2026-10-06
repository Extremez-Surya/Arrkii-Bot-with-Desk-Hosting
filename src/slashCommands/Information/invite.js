const {
  EmbedBuilder,
  MessageFlags,
  CommandInteraction,
  Client,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get The Bot Invite Link",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const invite = client.config.links.invite;
    const color = client.color;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(`${client.config.links.invite}`),
    );

    const mainPage = new EmbedBuilder()
      .setDescription(`Click [Here](${invite}) To Invite Me Or Click Below `)
      .setColor(color);
    interaction.editReply({ embeds: [mainPage], components: [row] });
  },
};
