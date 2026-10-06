const { EmbedBuilder } = require("discord.js");
const AntiNuke = require("../../schema/antinuke");

module.exports = {
  name: "webhooksUpdate",
  run: async (client, oldWebhook, newWebhook) => {
    try {
      const antiNukeSettings = await AntiNuke.findOne({
        guildId: oldWebhook.guild.id,
      });
      if (!antiNukeSettings || !antiNukeSettings.isEnabled) return;

      const { extraOwners, whitelistUsers, whitelistRoles, logChannelId } =
        antiNukeSettings;

      // Fetch the latest audit log for WEBHOOK_UPDATE
      const auditLogs = await oldWebhook.guild
        .fetchAuditLogs({
          limit: 1,
          type: 23, // Numeric type for WEBHOOK_UPDATE
        })
        .catch(() => null);

      const logEntry = auditLogs?.entries?.first();
      if (!logEntry) return;

      const { executor } = logEntry;

      // Skip if the executor is authorized
      if (
        [oldWebhook.guild.ownerId, client.user.id, ...extraOwners].includes(
          executor.id,
        )
      )
        return;

      const executorMember = await oldWebhook.guild.members
        .fetch(executor.id)
        .catch(() => null);
      if (!executorMember) return;

      const isExecutorWhitelisted = whitelistUsers.includes(executor.id);
      const isExecutorRoleWhitelisted = executorMember.roles.cache.some(
        (role) => whitelistRoles.includes(role.id),
      );

      // If the executor is not whitelisted, ban them
      if (!isExecutorWhitelisted && !isExecutorRoleWhitelisted) {
        await oldWebhook.guild.members
          .ban(executor.id, { reason: "Unauthorized webhook update" })
          .catch(() => null);
        if (logChannelId) {
          const logChannel = oldWebhook.guild.channels.cache.get(logChannelId);
          if (logChannel) {
            const logEmbed = new EmbedBuilder()
              .setColor(client.color || "#ff0000") // Default to red if client.color is undefined
              .setTitle("Unauthorized Webhook Update")
              .setDescription(
                `A webhook was updated by **${executor.tag}** (${executor.id}).`,
              )
              .addFields([
                {
                  name: "Executor",
                  value: `${executor.tag} (${executor.id})`,
                  inline: true,
                },
                { name: "Webhook Name", value: oldWebhook.name, inline: true },
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
      console.error("[ANTINUKE] Error in webhookUpdate:", err);
    }
  },
};
