const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  aliases: ["dc"],
  category: "Music",
  cooldown: 3,
  description: "Leave voice channel",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player) return message.channel.send(`i'm not in any vc!`);

    const emojiLeave = message.client.emoji.leave;
      client.rest
      .put(`/channels/${player.voiceId}/voice-status`, { body: { status: `` } })
      .catch(() => null);
    await player.destroy(message.guild.id);
    await player.data.set("autoplay", false);

    const thing = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${client.emoji.leave} | Leaved the voice channel`);
    return message.reply({ embeds: [thing] });
  },
};
