const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/247");

module.exports = {
  name: "config",
  category: "Config",
  description: "To check text & voice channels",
  userPrams: [],
  botPrams: ["EmbedLinks"],
  owner: false,
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    const data = await db.findOne({ Guild: message.guild.id });
    const text = (await player) ? `<#${player.textId}>` : "play something";
    const autoplay = (await player.data.set("autoplay", true)) ? client.emoji.tick : client.emoji.cross;
    const voice = (await player) ? `<#${player.voiceId}>` : "play something";
    const status = data ? client.emoji.tick : client.emoji.cross;

    const embed = new client.embed()
      .setAuthor({
        name: `Server Configuration`,
        iconURL: message.guild.iconURL(),
      })
      .d(
        `**Prefix For This Server:** \`${prefix}\`\n- **Autoplay:** ${autoplay}\n- **247:** ${status}\n- **Player Created:** ${player ? client.emoji.tick : client.emoji.cross}\n${player ? `> ${client.emoji.dot} **Text:** ${text}\n> ${client.emoji.dot} **Voice:** ${voice}` : " "}`,
      )
      .setFooter({
        text: client.config.links.power,
        url: client.config.links.support,
      });
    await message.channel.send({ embeds: [embed] });
  },
};
