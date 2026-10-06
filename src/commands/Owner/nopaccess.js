const {
  EmbedBuilder,
  MessageFlags,
  collector,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const db = require("../../schema/accessnop");
const lodash = require("lodash");

module.exports = {
  name: `nopaccess`,
  aliases: ["nopperms", "npp"],
  category: "Owner",
  description: "No prefix toggling",
  args: false,
  usage: "",
  owner: true,
  execute: async (message, args, client, prefix) => {
    const PanDa = client.users.cache.get("504232260548165633");
    if (!PanDa) {
      message.channel.send(`Sirf ${PanDa} Access De Sakta Hain Lawde`);
      return;
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              ` \`\`\`[] = Optional Argument\n<> = Required Argument\nDo NOT type these when using commands!)\`\`\`\n\n**Aliases:**\n\`\`[access]\`\`\n**Usage:**\n\`\`add/remove/list\`\``,
            ),
        ],
      });
    }

    const opt = args[0].toLowerCase();

    if (opt === `add` || opt === `a` || opt === `+`) {
      const user =
        message.mentions.users.first() || client.users.cache.get(args[1]);
      if (!user) return message.reply({ content: `Provide me a valid user` });

      const npData = await db.findOne({ userId: user.id });
      if (npData)
        return message.reply({
          content: `${client.emoji.astrix || "🌙"} | This user is already in my nopaccess system.`,
        });
      else {
        const data = await db.create({
          userId: user.id,
          noprefix: true,
        });

        const embedn = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `_Now ${user} U Have NopAccess! Add By ${message.author}_`,
          )
          .setFooter({
            text: `Keep Supporting Us <3`,
            iconURL: message.guild.iconURL(),
          });

        return message.reply({ embeds: [embedn] });
      }
    }
    if (opt === `remove` || opt === `r` || opt === `-`) {
      const user =
        message.mentions.users.first() || client.users.cache.get(args[1]);
      if (!user) return message.reply({ content: `Provide me a valid user` });

      const npData = await db.findOne({ userId: user.id });
      if (!npData)
        return message.reply({
          content: `${client.emoji.astrix || "🌙"} | Ye Prani Mere Nop Access Me Nahi Hain`,
        });

      await db.deleteOne({ userId: user.id });
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.tick} | SuccessFully **Removed** ${user} From My NopAccess`,
            ),
        ],
      });
    }

    if (args[0].toLowerCase() === `list` || args[0].toLowerCase() === `show`) {
      const data = await db.find();
      const listing = [];
      data.forEach((x) => listing.push(x.userId));

      if (!listing.length) {
        return message.reply({ content: `There Is No User In My NopAccess` });
      }
      const list = data.map((x) => `<@${x.userId}>`);
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: `NopAccess List`, iconURL: message.guild.iconURL() })
        .setFooter({
          text: `${PanDa.username}`,
          iconURL: PanDa.displayAvatarURL(),
        })
        .setDescription(`${list.join("\n")}`);
      return message.channel.send({ embeds: [embed] });
    } else if (opt === `clear`) {
      const data = await db();

      if (!data) return message.channel.send({ content: `0` });
      await db.deleteMany();
      return message.channel.send({
        content: `Successfully Cleared Access Of Nop`,
      });
    }
  },
};
