const {
  CommandInteraction,
  Client,
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  Permissions,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");

module.exports = {
  name: "play",
  description: "To play some song.",
  userPrams: [],
  botPrams: ["Connect", "Speak"],
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "input",
      description: "The search input (name/url)",
      required: true,
      type: 3,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const emojiaddsong = client.emoji.addsong;
    const emojiplaylist = client.emoji.playlist;
    const query = interaction.options.getString("input");

    const player = await client.manager.createPlayer({
      guildId: interaction.guildId,
      voiceId: interaction.member.voice.channelId,
      textId: interaction.channelId,
      deaf: true,
    });
    const result = await player.search(query, { requester: interaction.user });
    if (!result.tracks.length)
      return interaction.editReply({ content: "No result was found" });
    const tracks = result.tracks;
    if (result.type === "PLAYLIST")
      for (const track of tracks) player.queue.add(track);
    else player.queue.add(tracks[0]);
    if (!player.current) player.play();
    return interaction.editReply(
      result.type === "PLAYLIST"
        ? {
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${emojiplaylist} Queued ${tracks.length} from ${result.playlistName}`,
                ),
            ],
          }
        : {
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${emojiaddsong} Queued [${tracks[0].title}](${tracks[0].uri})`,
                ),
            ],
          },
    );
  },
};
