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
  name: "vote",
  description: "Get The Vote Link",
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
        .setLabel("Vote!")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://top.gg/bot/1033496708992204840/vote`),
    );

    const mainPage = new EmbedBuilder()
      .setDescription(
        `Click [Here](https://top.gg/bot/1033496708992204840/vote) To Vote Me Or Click Below `,
      )
      .setColor(color);
    interaction.editReply({ embeds: [mainPage], components: [row] });
  },
};
