const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const Profile = require("../../schema/profile"); // Adjust this path to your schema.

module.exports = {
  name: "bioset",
  aliases: ["profileedit", "bioedit", "bio"],
  category: "Profile",
  cooldown: 5,
  description: "Edit your bio or social media links.",
  args: false,
  usage: "",
  botPerms: ["EmbedLinks"],
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const user = message.author;

    // Retrieve or create the user's profile
    let profile = await Profile.findOne({ User: user.id });
    if (!profile) {
      profile = new Profile({ User: user.id, Bio: "", SocialMedia: {} });
      await profile.save();
    }

    // Main embed with instructions
    const embed = new EmbedBuilder()
      .setColor(client.color || "#5865F2")
      .setTitle("🔧 Profile Editor")
      .setDescription("Select an option below to edit your profile.")
      .setFooter({
        text: "Profile Editor | Expires in 1 minute",
        iconURL: client.user.displayAvatarURL(),
      });

    const mainRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bio")
        .setLabel("📝 Edit Bio")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("social")
        .setLabel("🌐 Edit Social Media")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("reset")
        .setLabel("❌ Reset Profile")
        .setStyle(ButtonStyle.Danger),
    );

    const msg = await message.reply({ embeds: [embed], components: [mainRow] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== user.id) {
        return interaction.reply({
          content: "🚫 This interaction is not for you.",
          ephemeral: true,
        });
      }

      try {
        switch (interaction.customId) {
          case "bio": {
            const bioModal = new ModalBuilder()
              .setCustomId("bioModal")
              .setTitle("📝 Edit Your Bio")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("bioInput")
                    .setLabel("Enter your new bio:")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(200)
                    .setRequired(true),
                ),
              );
            await interaction.showModal(bioModal);
            break;
          }
          case "social": {
            const socialRow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("twitter")
                .setLabel("🐦 Twitter")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("instagram")
                .setLabel("📸 Instagram")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId("discord")
                .setLabel("💬 Discord")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId("back")
                .setLabel("🔙 Back")
                .setStyle(ButtonStyle.Primary),
            );

            await interaction.update({
              content: "🌐 Select a social media platform to update:",
              embeds: [],
              components: [socialRow],
            });
            break;
          }
          case "reset": {
            await Profile.updateOne(
              { User: user.id },
              { $set: { Bio: "", SocialMedia: {} } },
            );
            await interaction.update({
              content: "✅ Your profile has been reset.",
              embeds: [],
              components: [],
            });
            break;
          }
          case "back": {
            await interaction.update({
              embeds: [embed],
              components: [mainRow],
            });
            break;
          }
          default: {
            const platforms = ["twitter", "instagram", "discord"];
            if (platforms.includes(interaction.customId)) {
              const modal = new ModalBuilder()
                .setCustomId(`${interaction.customId}Modal`)
                .setTitle(
                  `Add Your ${interaction.customId.charAt(0).toUpperCase() + interaction.customId.slice(1)} Link`,
                )
                .addComponents(
                  new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                      .setCustomId(`${interaction.customId}Link`)
                      .setLabel(
                        `Enter your ${interaction.customId} profile link:`,
                      )
                      .setStyle(TextInputStyle.Short)
                      .setPlaceholder(
                        `e.g. https://${interaction.customId}.com/yourprofile`,
                      )
                      .setRequired(true)
                      .setMaxLength(200),
                  ),
                  new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                      .setCustomId(`${interaction.customId}Username`)
                      .setLabel(`Enter your ${interaction.customId} username:`)
                      .setStyle(TextInputStyle.Short)
                      .setRequired(true)
                      .setMaxLength(50),
                  ),
                );
              await interaction.showModal(modal);
            }
          }
        }
      } catch (error) {
        console.error("Error handling interaction:", error);
        await interaction.reply({
          content: "❌ An error occurred. Please try again.",
          ephemeral: true,
        });
      }
    });

    // Disable buttons after timeout
    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("bio")
          .setLabel("📝 Edit Bio")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("social")
          .setLabel("🌐 Edit Social Media")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("reset")
          .setLabel("❌ Reset Profile")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
      );
      msg.edit({ components: [disabledRow] }).catch(console.error);
    });
  },

  // Modal submission handler
  modalHandler: async (interaction) => {
    try {
      if (interaction.customId === "bioModal") {
        const newBio = interaction.fields.getTextInputValue("bioInput").trim();
        if (!newBio)
          return interaction.reply({
            content: "❌ Bio cannot be empty.",
            ephemeral: true,
          });

        await Profile.updateOne(
          { User: interaction.user.id },
          { $set: { Bio: newBio } },
        );
        return interaction.reply({
          content: `✅ Your bio has been updated to: \`${newBio}\``,
          ephemeral: true,
        });
      }

      const platforms = ["twitter", "instagram", "discord"];
      for (const platform of platforms) {
        if (interaction.customId === `${platform}Modal`) {
          const link = interaction.fields
            .getTextInputValue(`${platform}Link`)
            .trim();
          const username = interaction.fields
            .getTextInputValue(`${platform}Username`)
            .trim();

          if (!link || !username) {
            return interaction.reply({
              content: "❌ Both username and link must be provided.",
              ephemeral: true,
            });
          }

          await Profile.updateOne(
            { User: interaction.user.id },
            {
              $set: {
                [`SocialMedia.${platform}.link`]: link,
                [`SocialMedia.${platform}.username`]: username,
              },
            },
          );

          return interaction.reply({
            content: `✅ Your ${platform} details have been updated: [${username}](${link})`,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error("Error handling modal submission:", error);
      await interaction.reply({
        content: "❌ An error occurred while updating your profile.",
        ephemeral: true,
      });
    }
  },
};
