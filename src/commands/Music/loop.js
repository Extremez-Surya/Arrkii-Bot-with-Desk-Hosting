module.exports = {
  name: "loop",
  aliases: ["repeat"],
  category: "Music",
  cooldown: 3,
  description: "Toggle music loop mode (track, queue, or off)",
  botPrams: ["EmbedLinks"],
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.queue.current) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Queue Empty\n> Play a song first before setting loop.`
      );
      return c.reply(message);
    }

    if (args[0] && ["q", "queue"].includes(args[0].toLowerCase())) {
      player.setLoop("queue");
      const c = new client.container(0x2b2d31).text(
        `> 🔁 **Loop Mode:** Queue loop is now **Enabled**.`
      );
      return c.reply(message);
    }

    const nextMode = player.loop === "track" ? "none" : "track";
    player.setLoop(nextMode);
    const c = new client.container(0x2b2d31).text(
      `> 🔁 **Loop Mode:** Track loop is now **${nextMode === "track" ? "Enabled" : "Disabled"}**.`
    );
    return c.reply(message);
  },
};
