const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["hata"],
  category: "Music",
  cooldown: 3,
  description: "Remove song from the queue",
  args: true,
  usage: "Number of song in queue",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player.queue.current) {
      return message.channel.send({
        embeds: [new client.embed().d(`Play a song first!`)],
      });
    }

    const position = Number(args[0]) - 1;
    if (position > player.queue.length) {
      const number = position + 1;
      const thing = new EmbedBuilder()
        .setColor("2f3136")
        .setDescription(
          `${client.emoji.cross} | No songs at number ${number}.\nTotal Songs: ${player.queue.length}`,
        );
      return message.reply({ embeds: [thing] });
    }

    const song = player.queue[position];

    await player.queue.splice(position, 1);

    const emojieject = client.emoji.remove;

    const thing = new EmbedBuilder()
      .setColor("2f3136")
      .setDescription(
        `${client.emoji.tick} | Removed - [${song.title}](${client.config.links.support})`,
      );
    return message.reply({ embeds: [thing] });
  },
};
