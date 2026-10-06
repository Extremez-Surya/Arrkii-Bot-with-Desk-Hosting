const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "unlockall",
  category: "Moderation",
  aliases: ["unlockchannels"],
  cooldown: 3,
  description: "to lock all channels in a guild",
  args: false,
  usage: "",
  userPerms: ["ManageChannels"],
  botPerms: ["ManageChannels"],
  owner: false,
  execute: async (message, args, client, prefix) => {
    if (!message.member.permissions.has("ManageChannels")) {
      const error = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `You must have \`Manage Channels\` permission to use this command.`,
        );
      return message.reply({ embeds: [error] });
    }

    let c = 0;
    message.guild.channels.cache.forEach((ch) => {
      ch.permissionOverwrites.edit(message.guild.id, {
        SendMessages: true,
      });
      c++;
    });
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `${client.emoji.tick} | SuccessFully **Unlocked** ${c} Channels.`,
          ),
      ],
    });
  },
};
