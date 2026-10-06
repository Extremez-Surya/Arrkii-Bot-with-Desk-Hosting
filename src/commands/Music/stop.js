module.exports = {
  name: "stop",
  category: "Music",
  cooldown: 3,
  description: "Stops the music and clears the queue",
  args: false,
  usage: "",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  dj: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.queue.current) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before stopping.`
      );
      return c.reply(message);
    }

    player.queue.clear();
    player.data.delete("autoplay");
    player.loop = "none";
    player.playing = false;
    player.paused = false;
    player.autoplay = false;
    await player.skip();

    const c = new client.container(0x2b2d31).text(
      `> ⏹️ **Playback Stopped:** Cleared the queue and left voice channel.`
    );
    return c.reply(message);
  },
};
