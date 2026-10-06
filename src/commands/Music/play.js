const {
  MessageFlags,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");

module.exports = {
  name: "play",
  category: "Music",
  aliases: ["p"],
  cooldown: 3,
  description: "Plays audio from YouTube, Spotify or Soundcloud",
  args: false,
  usage: "Song URL or Name To Play",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  owner: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    if (!args[0]) {
      const c = new client.container(0x2b2d31).text(
        `### ❓ Play Command\n` +
        `> **Usage:** \`${prefix}play <song name or url>\`\n` +
        `> **Example:** \`${prefix}play let her go\``
      );
      return c.reply(message);
    }

    const { channel } = message.member.voice;
    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(["Speak", "Connect"])
      )
    ) {
      const c = new client.container(0x2b2d31).text(
        `### ⚠️ Missing Permissions\n` +
        `> Astrix needs \`CONNECT\` and \`SPEAK\` permissions in <#${channel.id}>.`
      );
      return c.reply(message);
    }

    const query = args.join(" ");

    const player = await client.manager.createPlayer({
      guildId: message.guild.id,
      voiceId: message.member.voice.channel.id,
      textId: message.channel.id,
      volume: 80,
      deaf: true,
    });

    const result = await player.search(query, { requester: message.author });

    if (!result.tracks.length) {
      const c = new client.container(0x2b2d31).text(
        `### ❌ No Results\n` +
        `> No playable tracks found for: \`${query.substring(0, 50)}\``
      );
      return c.reply(message);
    }

    const tracks = result.tracks;

    if (result.type === "PLAYLIST") {
      for (const track of tracks) player.queue.add(track);
    } else {
      player.queue.add(tracks[0]);
    }

    if (!player.playing && !player.paused) player.play();

    if (result.type === "PLAYLIST") {
      const c = new client.container(0x2b2d31).text(
        `### 💿 Playlist Added\n` +
        `> • **Playlist:** \`${result.playlistName || "Custom Playlist"}\`\n` +
        `> • **Tracks:** \`${tracks.length} tracks\`\n` +
        `> • **Requested By:** <@${message.author.id}>\n` +
        `> \n` +
        `> -# Astrix Music • Added to queue`
      );
      return c.reply(message);
    } else {
      const track = tracks[0];
      const c = new client.container(0x2b2d31).text(
        `### 🎶 Track Added\n` +
        `> • **[${track.title}](${track.uri || client.config.links.support})**\n` +
        `> • **Author:** \`${track.author || "Unknown"}\` • **Duration:** \`${convertTime(track.length)}\`\n` +
        `> • **Queue Position:** \`#${player.queue.length}\`\n` +
        `> \n` +
        `> -# Astrix Music • Requested by ${message.author.username}`
      );
      return c.reply(message);
    }
  },
};
