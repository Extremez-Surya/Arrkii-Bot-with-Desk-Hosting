const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/afk");

module.exports = {
  name: "afk",
  category: "Utility",
  aliases: ["busy"],
  cooldown: 3,
  description: "Set AFK status for the user",
  args: false,
  usage: "",
  userPerms: [],
  botPerms: [],
  owner: false,

  execute: async (message, args, client) => {
    const reason = args.join(" ") || "I'm AFK :)";

    const me = await db.create({
      Guild: message.guildId,
      Member: message.author.id,
      Reason: reason,
      Time: Date.now(),
    });

    // if (me) return message.reply(`ur afk already`);
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Your AFK is now set to: **${reason}**`)
          .setColor(client.color),
      ],
    });
  },
};
