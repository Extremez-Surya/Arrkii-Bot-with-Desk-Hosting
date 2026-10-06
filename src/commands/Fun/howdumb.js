const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "howdumb",
  category: "Fun",
  aliases: ["dumb"],
  cooldown: 3,
  description: "Sends you your dumb rate",
  args: false,
  usage: "dumbrate [user]",
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
            .setDescription(`___Please mention a user to check dumb rate!___`),
        ],
      });
    }

    if (User.id === "504232260548165633") {
      const owner = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`He is not dumb like u`);
      message.reply({ embeds: [owner] });
    } else if (User) {
      const Dumbdalle = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `**${User} is ${gayrate}% dumb! <:orchuu_cutie:1217905176107815063>**`,
        );

      message.channel.send({ embeds: [Dumbdalle] });
    }
  },
};
