/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */
const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  WebhookClient,
  version,
  MessageFlags,
} = require("discord.js");
const db = require("../../schema/prefix.js");
const bl = require("../../schema/blacklist");
const IgnoreChannelModel = require("../../schema/ignorechannel");
const VoteBypassUserModel = require("../../schema/votebypassuser");
const db4 = require("../../schema/noprefix");
const cooldowns = new Map();

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot) return;

    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: message.guildId });
    if (ress && ress.Prefix) prefix = ress.Prefix;
    const reacter = new RegExp(`^<@!?${client.owner}>( |)$`);

    if (message.content.includes(client.owner)) {
      await message.react(client.emoji.owner).catch(() => {});
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve("SendMessages"),
        )
      )
        return await message.author
          .send({
            content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
          })
          .catch(() => null);

      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve("ViewChannel"),
        )
      )
        return;

      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve("EmbedLinks"),
        )
      )
        return await message.channel
          .send({
            content: `I don't have **\`EMBED_LINKS\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
          })
          .catch(() => {});
      const homeEmoji = client.emoji.home || "🏠";

      const makeHomePayload = (disabledBtn = "homm") => {
        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("sys").setLabel("System").setDisabled(disabledBtn === "sys"),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("abtt").setLabel("Team").setDisabled(disabledBtn === "abtt"),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("linkss").setLabel("Links").setDisabled(disabledBtn === "linkss"),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("homm").setEmoji(homeEmoji).setDisabled(disabledBtn === "homm"),
        ]);
        const c = new client.container(0x2b2d31);
        c.text(
          `### 🪐 Hey ${message.author.username}, I'm Astrix!\n` +
          `> A modern, minimal and ultra-fast Discord music bot.\n` +
          `> \n` +
          `> • **Prefix:** \`${prefix}\`\n` +
          `> • **Commands:** \`${prefix}help\`\n` +
          `> • **Ping:** \`${client.ws.ping}ms\`\n` +
          `> \n` +
          `> -# Click the buttons below for system stats & links!`
        );
        c.separator(true);
        c.addRow(row);
        return c.toPayload();
      };

      const makeSysPayload = () => {
        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("sys").setLabel("System").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("abtt").setLabel("Team").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("linkss").setLabel("Links").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("homm").setEmoji(homeEmoji).setDisabled(false),
        ]);
        const guildsCounts = client.guilds.cache.size;
        const channelsCounts = client.channels.cache.size;
        const usercount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);
        const lund = Math.round((Date.now() - (client.uptime || 0)) / 1000);
        const c = new client.container(0x2b2d31);
        c.text(
          `### 📊 System Information\n` +
          `> • **Bot Name:** \`${client.user.username}\`\n` +
          `> • **Servers:** \`${client.numb(guildsCounts)}\` • **Users:** \`${client.numb(usercount)}\`\n` +
          `> • **Channels:** \`${client.numb(channelsCounts)}\` • **Commands:** \`${client.numb(client.commands.size)}\`\n` +
          `> • **Discord.js:** \`${version}\` • **Ping:** \`${client.ws.ping}ms\`\n` +
          `> • **Uptime:** <t:${lund}:R>\n` +
          `> \n` +
          `> -# Astrix • Minimal & Fast`
        );
        c.separator(true);
        c.addRow(row);
        return c.toPayload();
      };

      const makeTeamPayload = () => {
        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("sys").setLabel("System").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("abtt").setLabel("Team").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("linkss").setLabel("Links").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("homm").setEmoji(homeEmoji).setDisabled(false),
        ]);
        const c = new client.container(0x2b2d31);
        c.text(
          `### 👥 Astrix Team\n` +
          `> • **Developer & Owner:** [Extremez-Surya](https://discord.com/users/984409270344908872)\n` +
          `> \n` +
          `> -# Powered By Astrix Development 🌙`
        );
        c.separator(true);
        c.addRow(row);
        return c.toPayload();
      };

      const makeLinksPayload = () => {
        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("sys").setLabel("System").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("abtt").setLabel("Team").setDisabled(false),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("linkss").setLabel("Links").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("homm").setEmoji(homeEmoji).setDisabled(false),
        ]);
        const c = new client.container(0x2b2d31);
        c.text(
          `### 🔗 Quick Links\n` +
          `> • **[Invite Astrix](${client.config.links.invite})**\n` +
          `> • **[Support Server](${client.config.links.support})**\n` +
          `> • **[Vote on Top.gg](${client.config.links.topgg || "https://top.gg"})**\n` +
          `> \n` +
          `> -# Thank you for supporting Astrix!`
        );
        c.separator(true);
        c.addRow(row);
        return c.toPayload();
      };

      let mssg = null;
      try {
        mssg = await message.channel.send(makeHomePayload("homm"));
      } catch (err) {
        const fallbackEmbed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setDescription(`### 🪐 Hey ${message.author.username}, I'm Astrix!\n> Prefix for this server is \`${prefix}\`\n> Type \`${prefix}help\` for commands.`);
        mssg = await message.channel.send({ embeds: [fallbackEmbed] }).catch(() => null);
      }

      if (mssg) {
        const collector = mssg.createMessageComponentCollector({
          filter: (i) => {
            if (message.author.id === i.user.id) return true;
            i.reply({
              content: `> ${client.emoji.cross || "❌"} **That's not your session.** Tag Astrix to open your own.`,
              ephemeral: true,
            }).catch(() => {});
            return false;
          },
          time: 60000,
        });

        collector.on("collect", async (i) => {
          try {
            if (i.customId === "sys") {
              await i.update(makeSysPayload());
            } else if (i.customId === "abtt") {
              await i.update(makeTeamPayload());
            } else if (i.customId === "linkss") {
              await i.update(makeLinksPayload());
            } else if (i.customId === "homm") {
              await i.update(makeHomePayload("homm"));
            }
          } catch (e) {
            // ignore update errors
          }
        });

        collector.on("end", () => {
          mssg.edit({ components: [] }).catch(() => {});
        });
      }
    }

    const np = [];
    const npData = await db4.findOne({
      userId: message.author.id,
      noprefix: true,
    });
    if (npData) np.push(message.author.id);

    const regex = new RegExp(`^<@!?${client.user.id}>`);
    const pre = message.content.match(regex)
      ? message.content.match(regex)[0]
      : prefix;
    if (!np.includes(message.author.id)) {
      if (!message.content.startsWith(pre)) return;
    }

    const args =
      np.includes(message.author.id) === false
        ? message.content.slice(pre.length).trim().split(/ +/)
        : message.content.startsWith(pre) === true
          ? message.content.slice(pre.length).trim().split(/ +/)
          : message.content.trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );

    if (!command) return;
      
          const blusers = await bl.findOne({userId: message.author.id })
    if (blusers) {
      const embed = new client.embed().a(`You have been blacklisted from using the bot!`, message.author.displayAvatarURL());
      const m = await message.channel.send({ embeds: [embed] }).catch(() => null);
      setTimeout(() => m.delete().catch(() => null), 5000);
      return;
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000; // Default cooldown: 3 seconds

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = Math.round(expirationTime / 1_000);
        const cooldownEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `Please wait **<t:${timeLeft}:R>** before reusing the \`${command.name}\` command.`,
          );
        return message.reply({ embeds: [cooldownEmbed] }).then((msg) => {
          const delayTime = expirationTime - now; // Calculate the remaining cooldown time
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, delayTime);
        });
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    const ICHchannelId = message.channel.id;
    const isIgnored = await IgnoreChannelModel.findOne({
      guildId: message.guild.id,
      channelId: ICHchannelId,
    });
    if (isIgnored) {
      const baap = new EmbedBuilder()
        .setAuthor({
          name: `This channel is set to ignored channel..`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(client.color);
      const ignoreMessage = await message.channel.send({ embeds: [baap] }).catch(() => null);
      setTimeout(() => {
        ignoreMessage.delete().catch(console.error);
      }, 3000);
      return;
    }

    if (command.voteonly) {
      const hasVoted = await client.topgg.hasVoted(message.author.id);
      const voteBypassUser = await VoteBypassUserModel.findOne({
        userId: message.author.id,
      });
      if (!hasVoted && !voteBypassUser) {
        const embed = new EmbedBuilder()
          .setDescription(
            `__This Command Is Only For Our Voters So Vote Us Now By [Clicking Here](https://top.gg/bot/${client.user.id}/vote)__`,
          )
          .setColor(client.color);
        return message.channel.send({ embeds: [embed] }).catch(() => null);
      }
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("SendMessages"),
      )
    )
      return await message.author
        .send({
          content: `I don't have **\`SEND_MESSAGES\`** permission in <${message.guild.name}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("ViewChannel"),
      )
    )
      return;

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("EmbedLinks"),
      )
    )
      return await message.author
        .send({
          content: `I don't have **\`EMBED_LINKS\`** permission in <#${message.guild.name}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(reply);
      return message.channel.send({ embeds: [embed] }).catch(() => null);
    }

    if (command.botPerms) {
      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve(command.botPerms || []),
        )
      ) {
        const embed = new EmbedBuilder().setDescription(
          `I don't have **\`${command.botPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
        );
        return message.channel.send({ embeds: [embed] }).catch(() => null);
      }
    }
    if (command.userPerms) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.userPerms || []),
        )
      ) {
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `You don't have **\`${command.userPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
          );
        return message.channel.send({ embeds: [embed] }).catch(() => null);
      }
    }

    const isOwner =
      (client.owner && (Array.isArray(client.owner) ? client.owner.includes(message.author.id) : client.owner === message.author.id)) ||
      message.author.id === "984409270344908872";

    if (command.owner && !isOwner) {
      const ownerUser = await client.users.fetch("984409270344908872").catch(() => null);
      const embed = new EmbedBuilder().setColor(client.color).setAuthor({
        name: `| Only ${ownerUser ? ownerUser.displayName : "Bot Owner"} can use this command!`,
        iconURL: message.author.displayAvatarURL(),
      });
      return message.channel.send({ embeds: [embed] }).catch(() => null);
    }

    const player = client.manager.players.get(message.guild.id);
    if (command.player && !player) {
      return message.channel.send(`i'm not in any vc!`).catch(() => null);;
    }
    if (command.inVoiceChannel && !message.member.voice.channelId) {
      const embed = new EmbedBuilder().setColor(client.color).setAuthor({
        name: `Your are not in any vc`,
        iconURL: message.author.displayAvatarURL(),
        url: client.config.links.support,
      });
      return message.channel.send({ embeds: [embed] }).catch(() => null);
    }

    if (command.sameVoiceChannel) {
      if (message.guild.members.me.voice.channel) {
        if (
          message.guild.members.me.voice.channelId !==
          message.member.voice.channelId
        ) {
          const embed = new EmbedBuilder().setColor(client.color).setAuthor({
            name: `Your are not in same vc`,
            iconURL: message.author.displayAvatarURL(),
            url: client.config.links.support,
          });
          return message.channel.send({ embeds: [embed] }).catch(() => null);
        }
      }
    }
    //

    command.execute(message, args, client, prefix).catch((e) => {
      console.log(e);
    });
    if (command && command.execute) {
      const log = client.channels.cache.get(`1241614535568134236`);
      const web = new WebhookClient({
        url: client.config.Webhooks.cmdrun,
      });
      const commandlog = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.color)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(
          `Command Just Used In : \`${message.guild.name} | ${message.guild.id}\`\n Command Used In Channel : \`${message.channel.name} | ${message.channel.id}\`\n Command Name : \`${command.name}\`\n Command Executor : \`${message.author.tag} | ${message.author.id}\`\n Command Content : \`${message.content}\``,
        );
      web.send({ embeds: [commandlog] });
    }
  },
};
