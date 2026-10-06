const { EmbedBuilder } = require("discord.js");
const VoteBypassUserModel = require("../../schema/votebypassuser"); // Import your MongoDB model

module.exports = {
  name: "novote",
  aliases: ["nov"],
  category: "Owner",
  description: "Remove a user from the vote bypass list.",
  args: true,
  owner: false,
  execute: async (message, args, client, prefix) => {
    const devs = ["984409270344908872", client.config.ownerID];
    if (!devs.includes(message.author.id)) return;

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              ` \`\`\`[] = Optional Argument\n<> = Required Argument\nDo NOT type these when using commands!)\`\`\`\n\n**Aliases:**\n\`\`[nop]\`\`\n**Usage:**\n\`\`add/remove/list\`\``,
            ),
        ],
      });
    }

    const opt = args[0].toLowerCase();

    if (opt === `add`) {
      const u =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!u)
        return message.channel.send({
          content: `Please provide a valid user ID or mention.`,
        });
      let data = await VoteBypassUserModel.findOne({ userId: u.id });
      if (data)
        return message.channel.send({
          content: `This user is already in the vote bypass list.`,
        });
      data = new VoteBypassUserModel({ userId: u.id });
      await data.save();
      const embed = new EmbedBuilder().setDescription(
        `Successfully added ${u} from the vote bypass list.`,
      );
      return message.channel.send({ embeds: [embed] });
    } else if (opt === `remove`) {
      const u =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!u)
        return message.channel.send({
          content: `Please provide a valid user ID or mention.`,
        });
      const data = await VoteBypassUserModel.findOne({ userId: u.id });
      if (!data)
        return message.channel.send({
          content: `This user is not in the vote bypass list.`,
        });
      await data.delete();
      const embed = new EmbedBuilder().setDescription(
        `Successfully removed ${u} from the vote bypass list.`,
      );
      return message.channel.send({ embeds: [embed] });
    } else if (opt === `list`) {
      const data = await VoteBypassUserModel.find();
      if (!data.length)
        return message.channel.send({
          content: `No users are in the vote bypass list.`,
        });
      const list = data.map((x) => `<@${x.userId}>`);
      const embed = new EmbedBuilder()

        .setAuthor({
          name: `Vote Bypass List`,
          iconURL: message.guild.iconURL(),
        })
        .setDescription(`${list.join("\n")}`);
      return message.channel.send({ embeds: [embed] });
    } else if (opt === `clear`) {
      const data = await VoteBypassUserModel.find();
      if (!data.length)
        return message.channel.send({
          content: `No users are in the vote bypass list.`,
        });
      await VoteBypassUserModel.deleteMany();
      return message.channel.send({
        content: `Successfully cleared the vote bypass list.`,
      });
    }
  },
};
