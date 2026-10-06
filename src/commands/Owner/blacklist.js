const {
  EmbedBuilder,
  MessageFlags,
  collector,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const db = require("../../schema/blacklist");
const NopAccess = require("../../schema/accessnop");
const lodash = require("lodash");

module.exports = {
  name: `blacklist`,
  aliases: ["bl"],
  category: "Owner",
  description: "No prefix toggling",
  args: false,
  usage: "",
  owner: false,
  execute: async (message, args, client, prefix) => {
    const OzuMA = await NopAccess.findOne({ userId: message.author.id });
    if (!OzuMA) {
      message.channel.send(`You can't add any user to my bl system`);
      return;
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              ` \`\`\`[] = Optional Argument\n<> = Required Argument\nDo NOT type these when using commands!)\`\`\`\n\n**Aliases:**\n\`\`[bl]\`\`\n**Usage:**\n\`\`add/remove\`\``,
            ),
        ],
      });
    }

    const opt = args[0].toLowerCase();

    if (opt === `add` || opt === `a` || opt === `+`) {
      const user =
        message.mentions.users.first() || client.users.cache.get(args[1]);
      if (!user) return message.reply({ content: `Provide me a valid user` });

      const npData = await db.findOne({ userId: user.id, noprefix: true });
      if (npData)
        return message.reply({
          content: `${client.emoji.astrix || "🌙"} | This user is already blacklisted`,
        });
      else {
        const data = await db.create({ userId: user.id });
        const embedn = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`${client.emoji.tick} | Added ${user} to blacklist`);
        return message.reply({ embeds: [embedn] });
      }
    } else if (opt === `remove` || opt === `r` || opt === `-`) {
      const user =
        message.mentions.users.first() || client.users.cache.get(args[1]);
      if (!user) return message.reply({ content: `Provide me a valid user` });

      const blData = await db.findOne({ userId: user.id });
      if (!blData)
        return message.reply({
          content: `${client.emoji.astrix || "🌙"} | This user is not blacklisted.`,
        });

      await db.deleteOne({ userId: user.id });
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.tick} | SuccessFully **Removed** ${user} from my blacklist.`,
            ),
        ],
      });
    }
  },
};
