const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const ms = require("ms");

module.exports = {
  name: "seek",
  aliases: [],
  category: "Music",
  cooldown: 3,
  description: "Seek the currently playing song",
  args: true,
  usage: "10s || 10m || 10h to seek",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  dj: true,
  owner: false,
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

    const time = ms(args[0]);

    const position = player.shoukaku.position;
    const duration = player.queue.current.length;
    const song = player.queue.current;

    if (time <= duration) {
      if (time > position) {
        await player.shoukaku.seekTo(time);
        const thing = new EmbedBuilder()
          .setDescription(
            `${client.emoji.tick} | **Forward** - [${song.title}](${client.config.links.support})\n\`${convertTime(
              time,
            )} / ${convertTime(duration)}\``,
          )
          .setColor("2f3136");
        return message.reply({ embeds: [thing] });
      } else {
        await player.shoukaku.seekTo(time);
        const thing = new EmbedBuilder()
          .setDescription(
            `${client.emoji.tick} | **Rewind** - [${song.title}](${client.config.links.support})\n\`${convertTime(
              time,
            )} / ${convertTime(duration)}\``,
          )
          .setColor("2f3136");
        return message.reply({ embeds: [thing] });
      }
    } else {
      const thing = new EmbedBuilder()
        .setColor("2f3136")
        .setDescription(
          `${client.emoji.cross} | Seek duration exceeds Song duration.\nSong duration: \`${convertTime(duration)}\``,
        );
      return message.reply({ embeds: [thing] });
    }
  },
};
