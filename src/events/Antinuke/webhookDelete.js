const { EmbedBuilder } = require("discord.js");
const AntiNuke = require("../../schema/antinuke");

module.exports = {
  name: "webhookDelete",
  run: async (client, webhook) => {
    try {
      const antiNukeSettings = await AntiNuke.findOne({
        guildId: webhook.guild.id,
      });
      if (!antiNukeSettings || !antiNukeSettings.isEnabled) return;

      const { extraOwners, whitelistUsers, whitelistRoles, logChannelId } =
        antiNukeSettings;

      // Fetch the latest audit log for WEBHOOK_DELETE
      const auditLogs = await webhook.guild
        .fetchAuditLogs({
          limit: 1,
          type: 22,
        })
        .catch(() => null);

      const logEntry = auditLogs?.entries?.first();
      if (!logEntry) return;

      const { executor } = logEntry;

      if (
        [webhook.guild.ownerId, client.user.id, ...extraOwners].includes(
          executor.id,
        )
      )
        return;

      const executorMember = await webhook.guild.members
        .fetch(executor.id)
        .catch(() => null);
      if (!executorMember) return;

      const isExecutorWhitelisted = whitelistUsers.includes(executor.id);
      const isExecutorRoleWhitelisted = executorMember.roles.cache.some(
        (role) => whitelistRoles.includes(role.id),
      );
      if (!isExecutorWhitelisted && !isExecutorRoleWhitelisted) {
        await webhook.guild.members
          .ban(executor.id, { reason: "Unauthorized webhook deletion" })
          .catch(() => null);
        if (logChannelId) {
          const logChannel = webhook.guild.channels.cache.get(logChannelId);
          if (logChannel) {
            const logEmbed = new EmbedBuilder()
              .setColor(client.color || "#ff0000") // Default to red if client.color is undefined
              .setTitle("Unauthorized Webhook Deletion")
              .setDescription(
                `A webhook was deleted by **${executor.tag}** (${executor.id}).`,
              )
              .addFields([
                {
                  name: "Executor",
                  value: `${executor.tag} (${executor.id})`,
                  inline: true,
                },
                { name: "Webhook Name", value: webhook.name, inline: true },
                {
                  name: "Action Taken",
                  value: "Executor banned.",
                  inline: false,
                },
              ])
              .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] });
          }
        }
      }
    } catch (err) {
      console.error("[ANTINUKE] Error in webhookDelete:", err);
    }
  },
};
