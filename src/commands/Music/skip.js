module.exports = {
  name: "skip",
  aliases: ["s"],
  category: "Music",
  description: "To skip the current playing song.",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    if (!player || !player.queue.current) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before skipping.`
      );
      return c.reply(message);
    }

    const currentTitle = player.queue.current.title;
    const currentUri = player.queue.current.uri || client.config.links.support;
    await player.skip();

    const c = new client.container(0x2b2d31).text(
      `> ⏭️ **Skipped Track:** [${currentTitle}](${currentUri})`
    );
    return c.reply(message);
  },
};
