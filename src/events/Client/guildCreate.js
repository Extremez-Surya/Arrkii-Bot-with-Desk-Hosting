const { WebhookClient } = require("discord.js");
const {
  Webhooks: { guild_join },
} = require("../../config.js");

const moment = require("moment");

module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {
    const web = new WebhookClient({ url: guild_join });
    const own = await guild?.fetchOwner();
    const vanity = (await guild.vanityURLCode)
      ? `[Here is ${guild.name} invite ](https://discord.gg/${guild.vanityURLCode})`
      : `don't have vanity`;
    const embed = new client.embed()
      .thumb(guild.iconURL({ size: 1024 }))
      .t(`🔗 Joined a Guild !!`)
      .addFields([
        { name: "Server Name:", value: `> \`${guild.name}\`` },
        { name: "Server Id:", value: `> \`${guild.id}\`` },
        {
          name: "Server Owner:",
          value: `> \`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.displayName : "Unknown user"}\` ${own.id}`,
        },
        { name: "Member Count", value: `> \`${guild.memberCount}\` Members` },
        {
          name: "Creation Date",
          value: `> \`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\``,
        },
        { name: "Guild Invite", value: `> ${vanity}` },
      ])
      .setFooter({
        text: `Total Server Count [ ${client.guilds.cache.size} ]`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    web.send({ embeds: [embed] });
  },
};
