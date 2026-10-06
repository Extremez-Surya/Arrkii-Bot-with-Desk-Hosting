module.exports = {
  name: "pause",
  category: "Music",
  cooldown: 3,
  description: "Pause the currently playing music",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  dj: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    if (!player || !player.queue.current) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before pausing.`
      );
      return c.reply(message);
    }

    if (player.shoukaku.paused) {
      const c = new client.container(0x2b2d31).text(
        `> ⏸️ **Player is already paused.** Use \`${prefix}resume\` to continue playing.`
      );
      return c.reply(message);
    }

    await player.pause(true);
    const song = player.queue.current;
    const c = new client.container(0x2b2d31).text(
      `> ⏸️ **Playback Paused:** [${song.title}](${song.uri || client.config.links.support})`
    );
    return c.reply(message);
  },
};
