const {
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "invite",
  category: "Information",
  aliases: ["addme", "inv"],
  description: "Get the bot's invite link.",
  botPrams: ["EMBED_LINKS"],
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  cooldown: 3,
  execute: async (message, args, client, prefix) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.invite),

      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.support),
    );

    const mainPage = new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `Requested by ` + message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setDescription(
        `**Invite ${client.user.username}**\n**[Here](${client.config.links.invite})**`,
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setImage(client.config.links.astrix)
      .setColor(client.color);
    message.reply({ embeds: [mainPage], components: [row] });
  },
};

//
