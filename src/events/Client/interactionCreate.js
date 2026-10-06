const {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const db = require("../../schema/prefix.js");
const db3 = require("../../schema/setup");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: interaction.guildId });
    if (ress && ress.Prefix) prefix = ress.Prefix;

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const embed = new EmbedBuilder().setColor(client.color);

      if (command.botPerms) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPerms || []),
          )
        ) {
          embed.setDescription(
            `I don't have **\`${
              command.botPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`,
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.userPerms) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || []),
          )
        ) {
          embed.setDescription(
            `You don't have **\`${
              command.userPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`,
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      const player = interaction.client.manager.players.get(
        interaction.guildId,
      );
      if (command.player && !player) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `There is no player for this guild.`,
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => {});
        } else {
          return await interaction
            .reply({
              content: `There is no player for this guild.`,
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => {});
        }
      }
      if (command.inVoiceChannel && !interaction.member.voice.channel) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `You must be in a voice channel!`,
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => {});
        } else {
          return await interaction
            .reply({
              content: `You must be in a voice channel!`,
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => {});
        }
      }
      if (command.sameVoiceChannel) {
        // Ensure the guild and bot's member instance are defined
        if (!interaction.guild || !interaction.guild.members.me) {
          return await interaction
            .reply({
              content: `An error occurred. It seems the bot is not properly connected to the guild.`,
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => {});
        }

        const botVoiceChannel = interaction.guild.members.me.voice.channel;
        const userVoiceChannel = interaction.member.voice.channel;

        // Check if the bot is in a voice channel
        if (botVoiceChannel) {
          // Ensure the user is in the same voice channel as the bot
          if (userVoiceChannel !== botVoiceChannel) {
            return await interaction
              .reply({
                content: `You must be in the same ${botVoiceChannel.toString()} to use this command!`,
                flags: MessageFlags.Ephemeral,
              })
              .catch(() => {});
          }
        }
      }

      try {
        await command.run(client, interaction, prefix);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: `An unexcepted error occured.`,
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              flags: MessageFlags.Ephemeral,
              content: `An unexcepted error occured.`,
            })
            .catch(() => {});
        }
        console.error(error);
      }
    }

    if (interaction.isModalSubmit()) {
      try {
        const command = require("../../commands/Profile/bioset"); // Adjust path if necessary
        await command.modalHandler(interaction); // Call the modal handler
      } catch (error) {
        console.error("Error handling modal submission:", error);
        await interaction.reply({
          content:
            "There was an error processing your input. Please try again.",
        });
      }
    }

    if (interaction.isButton()) {
      const data = await db3.findOne({ Guild: interaction.guildId });
      if (
        data &&
        interaction.channelId === data.Channel &&
        interaction.message.id === data.Message
      )
        return client.emit("playerButtons", interaction, data);
    }
  },
};
