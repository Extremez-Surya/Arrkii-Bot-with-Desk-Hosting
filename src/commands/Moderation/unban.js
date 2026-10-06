const {
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "unban",
  category: "Moderation",
  aliases: ["Unban", "unBan"],
  cooldown: 3,
  description: "Unban a user by their ID.",
  userPerms: ["BanMembers"],
  botPerms: ["BanMembers"],
  execute: async (message, args, client) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | You must have \`Ban Members\` permissions to use this command.`,
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers,
      )
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | I lack the \`Ban Members\` permission to unban users.`,
            ),
        ],
      });
    }

    const userId = args[0];
    if (!userId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Usage: \`$unban <userID>\``),
        ],
      });
    }

    try {
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.get(userId);

      if (!bannedUser) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.color)
              .setDescription(`This user is not banned or does not exist.`),
          ],
        });
      }

      await message.guild.members.unban(userId);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${bannedUser.user.tag} has been unbanned.`),
        ],
      });
    } catch (error) {
      console.error(error);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `An error occurred while trying to unban the user.`,
            ),
        ],
      });
    }
  },
};
