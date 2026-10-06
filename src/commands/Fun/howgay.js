const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "howgay",
  category: "Fun",
  aliases: ["gay"],
  cooldown: 3,
  description: "Shows How Member Gay Is!",
  args: false,
  usage: "howgay <Mention Member>",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const User = message.mentions.members.first();
    const gayrate = Math.floor(Math.random() * 101);
    if (!User) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`___Please mention a user to check gay rate!___`),
        ],
      });
    }

    if (User.id === "504232260548165633") {
      const owner = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`He is not gay like u`);
      message.reply({ embeds: [owner] });
    } else if (User) {
      const gaydalle = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `**${User} is ${gayrate}% gay! <:orchuu_cutie:1217905176107815063>**`,
        );

      message.channel.send({ embeds: [gaydalle] });
    }
  },
};
