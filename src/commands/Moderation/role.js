const {
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "role",
  aliases: ["role"],
  cooldown: 3,
  description: "Gives a role to a user or a group of users",
  category: "Moderation",
  usage: "<user|humans|bots|all> <role>",
  example:
    "role @user Member\nrole humans Member\nrole bots Member\nrole all Member",
  userPerms: ["ManageRoles"],
  botPerms: ["ManageRoles"],
  roleonly: false,
  execute: async (message, args, client, prefix) => {
    let role = await findMatchingRoles(message.guild, args.slice(1).join(" "));
    role = role[0];

    const group = args[0].toLowerCase();

    const noneu = new EmbedBuilder().setColor(client.color).setAuthor({
      name: "Can You Please Mention A User!",
      iconURL: message.author.displayAvatarURL(),
    });

    const noner = new EmbedBuilder().setColor(client.color).setAuthor({
      name: "Can You Please Provide Me A Role!",
      iconURL: message.author.displayAvatarURL(),
    });

    if (!role) return message.reply({ embeds: [noner] });

    // Check for permissions
    if (
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position &&
      message.author.id !== message.guild.ownerId
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`,
            ),
        ],
      });
    }

    if (group === "humans" || group === "bots" || group === "all") {
      let members = [];
      if (group === "humans") {
        members = message.guild.members.cache.filter(
          (member) => !member.user.bot,
        );
      } else if (group === "bots") {
        members = message.guild.members.cache.filter(
          (member) => member.user.bot,
        );
      } else if (group === "all") {
        members = message.guild.members.cache;
      }

      // Now assign the role to all members in the selected group
      const giveRoleEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          `>>> **💖 Role: ${role} has been assigned to all members in ${group} group.**`,
        )
        .setFooter({
          text: "This operation might take a while depending on the number of members.",
        });

      await message.channel.send({ embeds: [giveRoleEmbed] }).catch(() => null);

      members.forEach((member) => {
        member.roles
          .add(role, `Assigned by ${message.author.username}`)
          .catch(() => {});
      });
    } else {
      // Handling individual user role assignment
      const user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);

      if (!user) return message.reply({ embeds: [noneu] });

      const givee = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `Successfully Updated Roles For A User`,
          iconURL: user.user.displayAvatarURL(),
        })
        .setDescription(
          `>>> **💖 Target User: ${user}\n${client.emoji.dot || "•"} Added: ${role}**`,
        )
        .setFooter({
          text: `Click on the Remove Role button to remove @${role.name} role from the target user.`,
        });

      const removee = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: `Successfully Updated Roles For A User`,
          iconURL: user.user.displayAvatarURL(),
        })
        .setDescription(
          `>>> **💖 Target User: ${user}\n${client.emoji.dot || "•"} Removed: ${role}**`,
        )
        .setFooter({
          text: `Click on the Add Role button to assign @${role.name} role to the target user.`,
        });

      const raadd = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("rad")
          .setLabel("Add Role"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId("rdel")
          .setEmoji(client.emoji.delete || "🗑️"),
      );

      const rremove = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("rr")
          .setLabel("Remove Role"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId("rdel")
          .setEmoji(client.emoji.delete || "🗑️"),
      );

      const action = user.roles.cache.has(role.id) ? "remove" : "add";
      const embed = user.roles.cache.has(role.id) ? removee : givee;
      const reason = `${action.charAt(0).toUpperCase()}${action.slice(1)} By ${message.author.username}`;
      const buttons = user.roles.cache.has(role.id) ? raadd : rremove;

      await user.roles[action](role, reason).catch(() => {});
      const msg = await message.channel.send({
        embeds: [embed],
        components: [buttons],
      }).catch(() => null);

      if (!msg) return;

      const collector = msg.createMessageComponentCollector({
        filter: (i) => {
          if (message.author.id === i.user.id) return true;
          else {
            i.reply({
              content: `${client.emoji.cross} | That's not your session. Run \`${prefix}role\` to create your own.`,
              flags: MessageFlags.Ephemeral,
            }).catch(() => {});
          }
        },
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "rad") {
          await user.roles.add(role).catch(() => {});
          i.update({ embeds: [givee], components: [rremove] }).catch(() => {});
        } else if (i.customId === "rr") {
          await user.roles.remove(role).catch(() => {});
          i.update({ embeds: [removee], components: [raadd] }).catch(() => {});
        } else if (i.customId === "rdel") {
          msg.delete().catch(() => {});
          collector.stop();
        }
      });

      collector.on("end", () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    }
  },
};

function findMatchingRoles(guild, query) {
  const ROLE_MENTION = /<?@?&?(\d{17,20})>?/;
  if (!guild || !query || typeof query !== "string") return [];

  const patternMatch = query.match(ROLE_MENTION);
  if (patternMatch) {
    const id = patternMatch[1];
    const role = guild.roles.cache.find((r) => r.id === id);
    if (role) return [role];
  }

  const exact = [];
  const startsWith = [];
  const includes = [];
  guild.roles.cache.forEach((role) => {
    const lowerName = role.name.toLowerCase();
    if (role.name === query) exact.push(role);
    if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role);
    if (lowerName.includes(query.toLowerCase())) includes.push(role);
  });
  if (exact.length > 0) return exact;
  if (startsWith.length > 0) return startsWith;
  if (includes.length > 0) return includes;
  return [];
}
