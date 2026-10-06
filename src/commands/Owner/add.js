const { EmbedBuilder } = require("discord.js");
const NopAccess = require("../../schema/accessnop");
const OxP1 = require("../../schema/noprefix");
const OxP2 = require("../../schema/votebypassuser");
const ms = require("ms"); // Install this with `npm install ms`

module.exports = {
  name: `add`,
  aliases: ["+"],
  category: "Owner",
  description: "Manage permissions and badges with a duration.",
  args: true,
  usage: "<user> <type> <duration>",
  owner: false,
  execute: async (message, args, client, prefix) => {
    const OzuMA = await NopAccess.findOne({ userId: message.author.id });
    if (!OzuMA) {
      return message.channel.send(
        "___You are not allowed to use this command!___",
      );
    }

    // Parse arguments
    const user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    const type = args[1]?.toLowerCase(); // Type: noprefix, votebypass, or all
    const duration = args[2];

    // Validate arguments
    if (!user) {
      return message.channel.send(
        "Please mention a user or provide a valid user ID.",
      );
    }
    if (!type || !["noprefix", "votebypass", "all"].includes(type)) {
      return message.channel.send(
        "Invalid type! Use `noprefix`, `votebypass`, or `all`.",
      );
    }
    if (!duration || !ms(duration)) {
      return message.channel.send(
        "Please provide a valid duration (e.g., `1h`, `1d`, `30m`).",
      );
    }

    const expirationTime = Date.now() + ms(duration);

    // Handle types
    if (type === "noprefix" || type === "all") {
      const nopData = await OxP1.findOne({ userId: user.id });
      if (nopData) {
        return message.channel.send(
          `${client.emoji.astrix || "🌙"} | This user already has NoPrefix.`,
        );
      }

      await OxP1.create({
        userId: user.id,
        noprefix: true,
        expiresAt: expirationTime,
      });
      message.channel.send(`✅ Added **NoPrefix** to ${user} for ${duration}.`);
    }

    if (type === "votebypass" || type === "all") {
      const voteData = await OxP2.findOne({ userId: user.id });
      if (voteData) {
        return message.channel.send(
          `${client.emoji.astrix || "🌙"} | This user already has VoteBypass.`,
        );
      }

      await OxP2.create({ userId: user.id, expiresAt: expirationTime });
      message.channel.send(
        `✅ Added **VoteBypass** to ${user} for ${duration}.`,
      );
    }

    if (type === "all") {
      message.channel.send(
        `✅ Added **NoPrefix** and **VoteBypass** to ${user} for ${duration}.`,
      );
    }
  },
};
