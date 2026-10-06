/** @format
 *
 * Astrix By Ozuma xd
 * © 2022 Astrix Development
 *
 */

const { PermissionsBitField, ChannelType } = require("discord.js");
const AntiNuke = require("../../schema/antinuke");

module.exports = {
  name: "antinuke",
  aliases: ["antiwizz", "an"],
  category: "Antinuke",
  description: "Enable or disable antinuke for the server",
  execute: async (message, args, client, prefix) => {
    const option = args[0]?.toLowerCase();
    const authorId = message.author.id;

    try {
      // Fetch or create the antinuke configuration for the guild
      let antinukeConfig = await AntiNuke.findOne({
        guildId: message.guild.id,
      });
      if (!antinukeConfig) {
        antinukeConfig = new AntiNuke({ guildId: message.guild.id });
        await antinukeConfig.save();
      }

      // Check if the user is authorized (server owner or extra owner)
      const isAuthorized =
        authorId === message.guild.ownerId ||
            authorId === client.owner ||
        (antinukeConfig.extraOwners || []).includes(authorId);

      if (!isAuthorized) {
        return message.reply({
          embeds: [
            new client.embed()
              .setColor(client.color)
              .setDescription(
                `${client.emoji.cross} | Only the **server owner** or an **extra owner** can use this command.`,
              ),
          ],
        });
      }

      // Display the antinuke information if no option is provided
      if (!option) {
        const antinukeEmbed = new client.embed()
          .setImage(client.config.links.astrix)
          .setColor(client.color)
          .setTitle("__**Antinuke**__")
          .setDescription(
            `${client.emoji.dot} It bans admins for suspicious activities in the server.\n` +
              `${client.emoji.dot} It ignores whitelisted members.\n` +
              `${client.emoji.dot} Antinuke must be enabled to protect the server.`,
          )
          .addFields([
            {
              name: `__**Antinuke Enable**__`,
              value: `To enable Antinuke, use \`${prefix}antinuke enable\`.`,
            },
            {
              name: `__**Antinuke Disable**__`,
              value: `To disable Antinuke, use \`${prefix}antinuke disable\`.`,
            },
          ]);
        return message.reply({ embeds: [antinukeEmbed] });
      }

      // Enable Antinuke with dynamic loading process
      if (option === "enable") {
        if (antinukeConfig.isEnabled) {
          const alreadyEnabledEmbed = new client.embed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.color)
            .setDescription(
              `**${message.guild.name} Security Settings** <:support:1220409940943048784>\n` +
                `Antinuke is already **enabled**.\n\n` +
                `To disable it, use \`${prefix}antinuke disable\`.`,
            );
          return message.channel.send({ embeds: [alreadyEnabledEmbed] });
        }

        const events = [
          "Anti Ban",
          "Anti Kick",
          "Anti Unban",
          "Anti Role Create/Delete/Update",
          "Anti Channel Create/Delete/Update",
          "Anti Webhook Create/Update/Delete",
          "Anti Sticker Create/Delete/Update",
          "Anti Everyone/Here",
          "Anti Server Update",
          "Anti Bot Add",
          "Anti Vanity Steal",
        ];

        let loadingMessage = await message.channel.send({
          embeds: [
            new client.embed()
              .setColor(client.color)
              .setDescription(
                `${client.emoji.loading} Loading Antinuke Process...`,
              ),
          ],
        });

        for (let i = 0; i < events.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          loadingMessage = await loadingMessage.edit({
            embeds: [
              new client.embed().setColor(client.color).setDescription(
                `${client.emoji.loading} Loading Antinuke Process...\n\n` +
                  `**Protected Actions:**\n` +
                  events
                    .slice(0, i + 1)
                    .map((event) => `${client.emoji.dot} ${event}`)
                    .join("\n"),
              ),
            ],
          });
        }

        // Create a logging channel for antinuke
        const logChannel = await message.guild.channels.create({
          name: `astrix-logs`,
          type: ChannelType.GuildText, // Use ChannelType.GuildText (integer value)
          permissionOverwrites: [
            {
              id: message.guild.id, // Everyone
              deny: [PermissionsBitField.Flags.ViewChannel], // Deny everyone the ability to view the channel
            },
            {
              id: message.guild.ownerId, // Server owner
              allow: [PermissionsBitField.Flags.ViewChannel], // Allow the server owner to view the channel
            },
            {
              id: client.user.id, // Bot user
              allow: [PermissionsBitField.Flags.ViewChannel], // Allow the bot to view the channel
            },
          ],
          reason: "Logging Channel for Antinuke",
        });

        // Save the log channel ID in the database
        antinukeConfig.isEnabled = true;
        antinukeConfig.logChannelId = logChannel.id;
        await antinukeConfig.save();

        const enableEmbed = new client.embed()
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(client.color)
          .setDescription(`${client.emoji.tick} __Loaded Antinuke Process__\n${client.emoji.tick} __All actions will be logged in the **<#${logChannel.id}>** channel.__**\n\n**Protected Actions:**\n<:dot:1201841280577970176> Anti Ban
<:dot:1201841280577970176> Anti Kick
<:dot:1201841280577970176> Anti Unban
<:dot:1201841280577970176> Anti Role Create/Delete/Update
<:dot:1201841280577970176> Anti Channel Create/Delete/Update
<:dot:1201841280577970176> Anti Webhook Create/Update/Delete
<:dot:1201841280577970176> Anti Sticker Create/Delete/Update
<:dot:1201841280577970176> Anti Everyone/Here
<:dot:1201841280577970176> Anti Server Update
<:dot:1201841280577970176> Anti Bot Add
<:dot:1201841280577970176> Anti Vanity Steal\n-# Note: To ensure the Anti-Nuke Module works properly, move my role to the top of the roles list.`);

        await loadingMessage.edit({ embeds: [enableEmbed] });
        return;
      }

      // Disable Antinuke
      if (option === "disable") {
        if (!antinukeConfig.isEnabled) {
          const alreadyDisabledEmbed = new client.embed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.color)
            .setDescription(
              `**${message.guild.name} Security Settings** <:support:1220409940943048784>\n\n` +
                `Antinuke is already **disabled**.\n\n` +
                `To enable Antinuke, use \`${prefix}antinuke enable\`.`,
            );
          return message.channel.send({ embeds: [alreadyDisabledEmbed] });
        }

        antinukeConfig.isEnabled = false;
        await antinukeConfig.save();

        const disableEmbed = new client.embed()
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(client.color)
          .setDescription(
            `**${message.guild.name} Security Settings** <:support:1220409940943048784>\n\n` +
              `Antinuke has been successfully **disabled**.\n\n` +
              `To enable Antinuke, use \`${prefix}antinuke enable\`.`,
          );
        return message.channel.send({ embeds: [disableEmbed] });
      }

      // If the option is invalid
      return message.reply({
        embeds: [
          new client.embed()
            .setColor(client.color)
            .setDescription(
              `Invalid option! Use \`${prefix}antinuke enable\` or \`${prefix}antinuke disable\`.`,
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new client.embed()
            .setColor(client.color)
            .setDescription(
              "An error occurred while managing Antinuke settings. Please try again later.",
            ),
        ],
      });
    }
  },
};
