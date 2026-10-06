/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const NopAccess = require("../../schema/accessnop");
const OxP1 = require("../../schema/noprefix");
const OxP2 = require("../../schema/votebypassuser");
const OxP3 = require("../../schema/badge");

module.exports = {
  name: `hata`,
  aliases: ["-"],
  category: "Owner",
  description: "No prefix toggling",
  args: false,
  usage: "",
  owner: false,
  execute: async (message, args, client, prefix) => {
    const OzuMA = await NopAccess.findOne({ userId: message.author.id });
    if (!OzuMA) {
      return message.channel.send("___You are not allowed to use this cmd!___");
    }

    const targetUser =
      client.users.cache.get(args[0]) || message.mentions.users.first();

    if (!targetUser) {
      return message.channel.send("Can you please mention a user to add?");
    } else if (!args[0]) {
      const oxp = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          ` \`\`\`[] = Optional Argument\n<> = Required Argument\nDo NOT type these when using commands!)\`\`\`\n\n**Aliases:**\n\`\`[remove, -]\`\`\n**Usage:**\n\`\`nop/nov/bdg\`\``,
        );
      return message.channel.send({ embeds: [oxp] });
    }

    if (args[1] === "nop") {
      const npData = await OxP1.findOne({
        userId: targetUser.id,
        noprefix: true,
      });
      if (!npData)
        return message.reply({
          content: `${client.emoji.astrix || "🌙"} | This user is not present in my no prefix system.`,
        });

      await OxP1.deleteOne({ userId: targetUser.id, noprefix: true });
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.tick} | Successfully **Removed** ${targetUser} from my no prefix.`,
            ),
        ],
      });
    } else if (args[1] === "nov") {
      const data = await OxP2.findOne({ userId: targetUser.id });
      if (!data)
        return message.channel.send({
          content: `This user is not in the vote bypass list.`,
        });

      await data.deleteOne();
      const embed = new EmbedBuilder().setDescription(
        `Successfully removed ${targetUser} from the vote bypass list.`,
      );
      return message.channel.send({ embeds: [embed] });
    } else if (args[1] === "bdg") {
      const cache = [];
      const selectedUser = message.mentions.users.first() || message.author;
      const data = await OxP3.findOne({ userId: selectedUser.id });

      if (data) {
        for (const [badge, value] of Object.entries(data.badge)) {
          if (value) {
            cache.push(
              `> ${client.emoji[badge]} **${badge.replace(
                /([a-z])([A-Z])/g,
                "$1 $2",
              )}**`,
            );
          }
        }
      }

      if (cache.length === 0) {
        cache.push(`Oops! **${selectedUser.username}** has no badges.`);
      }

      const Removing = Object.keys(data.badge)
        .filter((badge) => data.badge[badge])
        .map((badge) => ({
          label: badge.replace(/([a-z])([A-Z])/g, "$1 $2"),
          value: badge,
        }));

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("remove-badge")
          .setPlaceholder("Select a badge to remove")
          .setMinValues(1)
          .setMaxValues(Removing.length)
          .addOptions(Removing),
      );

      const embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setAuthor({
          name: `${selectedUser.username}'s Profile`,
          iconURL: `${selectedUser.displayAvatarURL({ dynamic: true })}`,
        })
        .setDescription(
          `[${selectedUser.displayName}'s](${
            client.config.links.support
          }) Badges\n${cache.join("\n")}`,
        )
        .setFooter({
          text: `Remove badges by selecting from the dropdown!`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setImage(client.config.links.astrix);

      const badgeMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const badgeCollector = await badgeMessage.createMessageComponentCollector(
        {
          filter: (i) => {
            if (message.author.id === i.user.id) return true;
            else {
              i.reply({
                content: `${client.emoji.cross} | That's not your session. Run \`${prefix}help\` to create your own.`,
                ephemeral: true,
              });
            }
          },
          time: 60000,
        },
      );

      badgeCollector.on("collect", async (i) => {
        if (i.customId === "remove-badge") {
          const badgesToRemove = i.values;
          const memberData = await OxP3.findOne({ userId: selectedUser.id });

          if (memberData) {
            badgesToRemove.forEach((badge) => {
              memberData.badge[badge] = false;
            });

            await memberData.save();

            i.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `Removed **${badgesToRemove.length}** badges from <@${selectedUser.id}>`,
                  ),
              ],
            });
          }
        }
      });
    }
  },
};
