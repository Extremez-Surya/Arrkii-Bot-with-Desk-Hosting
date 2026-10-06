module.exports = {
  name: "shuffle",
  aliases: ["shuff"],
  category: "Music",
  description: "Shuffle the upcoming tracks in queue",
  cooldown: 3,
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
        `### ⚠️ Queue Empty\n> Play a song first before shuffling.`
      );
      return c.reply(message);
    }

    if (player.queue.length <= 1) {
      const c = new client.container(0x2b2d31).text(
        `> 🔀 **Need at least 2 tracks in queue to shuffle.**`
      );
      return c.reply(message);
    }

    player.queue.shuffle();
    const c = new client.container(0x2b2d31).text(
      `> 🔀 **Queue Shuffled:** Successfully randomized \`${player.queue.length}\` tracks.`
    );
    return c.reply(message);
  },
};
