module.exports = {
  name: "resume",
  aliases: ["r"],
  category: "Music",
  cooldown: 3,
  description: "Resume currently playing music",
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
    const song = player?.queue?.current;

    if (!song) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before resuming.`
      );
      return c.reply(message);
    }

    if (!player.shoukaku.paused) {
      const c = new client.container(0x2b2d31).text(
        `> ▶️ **Player is already resumed and playing.**`
      );
      return c.reply(message);
    }

    await player.pause(false);
    const c = new client.container(0x2b2d31).text(
      `> ▶️ **Playback Resumed:** [${song.title}](${song.uri || client.config.links.support})`
    );
    return c.reply(message);
  },
};
