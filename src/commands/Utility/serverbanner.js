const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "serverbanner",
  category: "Utility",
  cooldown: 3,
  aliases: ["sbanner", "svbanner"],
  description: "to see server banner",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    if (message.guild.banner) {
      const embed = new EmbedBuilder()
        .setTitle(`${message.guild.name}'s Banner!`)
        .setColor("#2f3136")
        .setFooter({
          text: `Requested by` + message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setImage(message.guild.bannerURL({ size: 4096 }));
      message.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription(`This Server has no Banner!`)
        .setColor("#2f3136");
      message.reply({ embeds: [embed] });
    }
  },
};
