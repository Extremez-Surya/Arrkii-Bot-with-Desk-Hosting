const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const load = require("lodash");

module.exports = {
  name: "queue",
  description: "To see the whole server queue.",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  options: [
    {
      name: "page",
      type: 10, // Correct type for a number input
      required: false,
      description: `The queue page number.`,
    },
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply().catch(() => {});

    const player = client.manager.players.get(interaction.guildId);

    if (!player || !player.queue.current) {
      return await interaction
        .editReply({
          content: `Nothing is playing right now.`,
        })
        .catch(() => {});
    }

    const currentTrack = player.queue.current;
    const queue = player.queue;

    const mapping = queue.map(
      (track, index) =>
        `\`[ ${index + 1} ]\` • [${track.title}](${track.uri}) • \`[ ${
          track.isStream ? "[**◉ LIVE**]" : convertTime(track.length)
        } ]\` • [${track.requester}]`,
    );

    const chunk = load.chunk(mapping, 10);
    const pages = chunk.map((items) => items.join("\n"));
    let page = interaction.options.getNumber("page") || 1;

    page = Math.max(1, Math.min(page, pages.length)) - 1;

    const createQueueEmbed = (pageContent, pageIndex) => {
      return new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `**Now playing**\n[${currentTrack.title}](${client.config.links.support}) • \`[ ${
            currentTrack.isStream
              ? "[**◉ LIVE**]"
              : convertTime(currentTrack.length)
          } ]\` • [${currentTrack.requester}]\n\n**Queued Songs**\n${pageContent}`,
        )
        .setFooter({
          text: `Page ${pageIndex + 1}/${pages.length}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(
          currentTrack.thumbnail ||
            `https://img.spotify.com/track/${currentTrack.identifier}/hqdefault.jpg`,
        )
        .setTitle(`${interaction.guild.name} Queue`);
    };

    const embed = createQueueEmbed(pages[page], page);

    if (pages.length <= 1) {
      return await interaction
        .editReply({
          embeds: [embed],
        })
        .catch(() => {});
    }

    const nextButton = new ButtonBuilder()
      .setCustomId("queue_next")
      .setLabel(">>")
      .setStyle(ButtonStyle.Secondary);

    const prevButton = new ButtonBuilder()
      .setCustomId("queue_prev")
      .setLabel("<<")
      .setStyle(ButtonStyle.Secondary);

    const stopButton = new ButtonBuilder()
      .setCustomId("queue_stop")
      .setLabel("Close")
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder().addComponents(
      prevButton,
      stopButton,
      nextButton,
    );

    const message = await interaction
      .editReply({
        embeds: [embed],
        components: [actionRow],
      })
      .catch(() => {});

    const collector = message.channel.createMessageComponentCollector({
      filter: (button) => button.user.id === interaction.user.id,
      time: 60000 * 5,
      idle: 30e3,
    });

    collector.on("collect", async (button) => {
      await button.deferUpdate().catch(() => {});

      if (button.customId === "queue_next") {
        page = (page + 1) % pages.length;
      } else if (button.customId === "queue_prev") {
        page = (page - 1 + pages.length) % pages.length;
      } else if (button.customId === "queue_stop") {
        collector.stop();
        return;
      }

      const updatedEmbed = createQueueEmbed(pages[page], page);

      await interaction
        .editReply({
          embeds: [updatedEmbed],
          components: [actionRow],
        })
        .catch(() => {});
    });

    collector.on("end", async () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        prevButton.setDisabled(true),
        stopButton.setDisabled(true),
        nextButton.setDisabled(true),
      );

      await interaction
        .editReply({
          components: [disabledRow],
        })
        .catch(() => {});
    });
  },
};
