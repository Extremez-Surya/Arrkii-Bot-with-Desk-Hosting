const afk = require("../../schema/afk");
const moment = require("moment");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return;

    const mentioned = message.mentions.members.first();
    if (mentioned) {
      const data = await afk.findOne({
        Guild: message.guildId,
        Member: mentioned.id,
      });
      if (data) {
        message.reply({
          embeds: [
            new client.embed().d(
              `<@${mentioned.id}> is AFK <t:${Math.round(data.Time / 1000)}:R> - **${data.Reason}**`,
            ),
          ],
        });
      }
    }

    const authorData = await afk.findOne({
      Guild: message.guildId,
      Member: message.author.id,
    });
    if (authorData) {
      await afk.deleteOne({
        Guild: message.guildId,
        Member: message.author.id,
      });
      message.reply("I Removed Your AFK");
    }
  },
};
