module.exports = {
  name: "volume",
  aliases: ["v", "vol"],
  category: "Music",
  cooldown: 3,
  description: "Change volume of currently playing music",
  args: false,
  usage: "<number 0 - 150>",
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
        `### ⚠️ Queue Empty\n> Play a song first before setting volume.`
      );
      return c.reply(message);
    }

    if (!args.length) {
      const c = new client.container(0x2b2d31).text(
        `> 🔊 **Current Volume:** \`${player.volume}%\``
      );
      return c.reply(message);
    }

    const volume = Number(args[0]);

    if (isNaN(volume) || volume < 0 || volume > 150) {
      const c = new client.container(0x2b2d31).text(
        `### ❓ Invalid Volume\n> Please provide a valid number between \`0\` and \`150\`.\n> **Usage:** \`${prefix}volume <0-150>\``
      );
      return c.reply(message);
    }

    await player.setVolume(volume);
    const c = new client.container(0x2b2d31).text(
      `> 🔊 **Volume Adjusted:** Set to \`${volume}%\``
    );
    return c.reply(message);
  },
};
