const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const Preset = require("../../schema/preset");

module.exports = {
  name: "preset",
  aliases: ["presets", "musiccard"],
  category: "Config",
  args: false,
  execute: async (message, args, client, prefix) => {
    const presetImages = {
      0: "https://media.discordapp.net/attachments/1222557654916923432/1234789466439159859/preset4.png",
      1: "https://media.discordapp.net/attachments/1222557654916923432/1234789465508024321/preset1.png",
      2: "https://media.discordapp.net/attachments/1222557654916923432/1234789465868865586/preset2.png",
      3: "https://media.discordapp.net/attachments/1222557654916923432/1234789466145554452/preset3.png",
      4: "https://media.discordapp.net/attachments/1222557654916923432/1234789466439159859/preset4.png",
    };

    const currentDoc = await Preset.findOne({ guildId: message.guild.id });
    const currentPreset = currentDoc?.presetType ?? 0;

    const selectMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("preset_menu")
        .setPlaceholder("Choose a music player layout...")
        .addOptions([
          { label: "Preset 0 (Container V2)", value: "0", description: "Minimal, Modern & Ultra-Fast (Recommended)", emoji: "🪐" },
          { label: "Preset 1 (Quartz Card)", value: "1", description: "Quartz canvas graphics", emoji: "🎨" },
          { label: "Preset 2 (Classic Card)", value: "2", description: "Classic dark canvas card", emoji: "📻" },
          { label: "Preset 3 (Spotify Card)", value: "3", description: "Spotify style canvas banner", emoji: "🟢" },
          { label: "Preset 4 (Embed & Filters)", value: "4", description: "Container with interactive filter menu", emoji: "🎛️" },
        ])
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("save_preset").setLabel("Save Selected").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("reset_preset").setLabel("Reset to Container V2").setStyle(ButtonStyle.Secondary)
    );

    const makeMainContainer = (selected = currentPreset) => {
      const c = new client.container(0x2b2d31);
      c.text(
        `### 🎛️ Player Layout Presets\n` +
        `> Select your preferred music player UI layout for this server.\n` +
        `> \n` +
        `> • **Current Active Preset:** \`Preset ${selected}\`\n` +
        `> • **Preset 0:** Container V2 (Modern & Minimal)\n` +
        `> • **Preset 1-3:** Canvas Graphics Cards\n` +
        `> • **Preset 4:** Embed with Filter Menu\n` +
        `> \n` +
        `> -# Select from dropdown and click Save Selected`
      );
      c.separator(true);
      c.addRow(selectMenu);
      c.addRow(buttons);
      return c.toPayload();
    };

    let selectedPreset = String(currentPreset);
    let presetMessage = null;
    try {
      presetMessage = await message.reply(makeMainContainer(currentPreset));
    } catch {
      presetMessage = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(`### 🎛️ Player Presets\n> Active: \`Preset ${currentPreset}\``),
        ],
        components: [selectMenu, buttons],
      });
    }

    if (!presetMessage) return;

    const collector = presetMessage.createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id === message.author.id) return true;
        i.reply({
          content: `> ${client.emoji.cross || "❌"} **That's not your session.**`,
          ephemeral: true,
        }).catch(() => {});
        return false;
      },
      time: 60000,
    });

    collector.on("collect", async (i) => {
      try {
        if (i.isStringSelectMenu()) {
          selectedPreset = i.values[0];
          return await i.update(makeMainContainer(selectedPreset));
        }

        if (i.isButton()) {
          if (i.customId === "save_preset") {
            await Preset.updateOne(
              { guildId: message.guild.id },
              { $set: { presetType: parseInt(selectedPreset) } },
              { upsert: true }
            );

            return i.reply({
              content: `> ✅ **Preset Saved:** Music player set to **Preset ${selectedPreset}**!`,
              ephemeral: true,
            });
          }

          if (i.customId === "reset_preset") {
            await Preset.deleteMany({ guildId: message.guild.id });
            selectedPreset = "0";
            return i.reply({
              content: `> 🔄 **Preset Reset:** Reset to **Preset 0 (Container V2)**!`,
              ephemeral: true,
            });
          }
        }
      } catch (err) {
        // ignore
      }
    });

    collector.on("end", async () => {
      try {
        await presetMessage.edit({ components: [] });
      } catch (err) {}
    });
  },
};
