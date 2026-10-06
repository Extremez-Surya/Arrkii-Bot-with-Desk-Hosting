/** @format */

const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  EmbedBuilder,
} = require("discord.js");

module.exports = (client) => {
  return class AstrixContainer {
    constructor(accentColor = 0x2b2d31) {
      this.client = client;
      this.builder = new ContainerBuilder();
      this.rawText = "";
      
      let colorNum = 0x2b2d31;
      if (typeof accentColor === "string") {
        colorNum = parseInt(accentColor.replace("#", ""), 16);
      } else if (typeof accentColor === "number") {
        colorNum = accentColor;
      }
      if (!isNaN(colorNum)) {
        this.builder.setAccentColor(colorNum);
      }
    }

    setAccent(color) {
      const num = typeof color === "string" ? parseInt(color.replace("#", ""), 16) : color;
      if (!isNaN(num)) this.builder.setAccentColor(num);
      return this;
    }

    text(content) {
      if (content) {
        const textStr = String(content);
        this.rawText = (this.rawText ? this.rawText + "\n" : "") + textStr;
        this.builder.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(textStr)
        );
      }
      return this;
    }

    separator(divider = true) {
      this.builder.addSeparatorComponents(
        new SeparatorBuilder().setDivider(Boolean(divider))
      );
      return this;
    }

    row(...components) {
      if (components.length > 0) {
        const row = new ActionRowBuilder().addComponents(...components);
        this.builder.addActionRowComponents(row);
      }
      return this;
    }

    addRow(actionRow) {
      if (actionRow) {
        this.builder.addActionRowComponents(actionRow);
      }
      return this;
    }

    build() {
      return this.builder;
    }

    toPayload(extra = {}) {
      return {
        components: [this.builder],
        flags: MessageFlags.IsComponentsV2,
        ...extra,
      };
    }

    getFallbackEmbed() {
      return new EmbedBuilder()
        .setColor(this.client?.embedColor || "#2b2d31")
        .setDescription(this.rawText || "Astrix Notification");
    }

    async send(target, extra = {}) {
      try {
        return await target.send(this.toPayload(extra));
      } catch (err) {
        // Fallback for channels/webhooks where IsComponentsV2 might fail
        const fallbackEmbed = this.getFallbackEmbed();
        return await target.send({ embeds: [fallbackEmbed], ...extra }).catch(() => null);
      }
    }

    async reply(target, extra = {}) {
      const payload = this.toPayload({
        failIfNotExists: false,
        allowedMentions: { repliedUser: false },
        ...extra,
      });

      try {
        if (typeof target.reply === "function") {
          return await target.reply(payload);
        }
        return await target.send(payload);
      } catch (err) {
        // If message was deleted or reply failed (Unknown Message 10008 / 50035)
        const channel = target.channel || target;
        try {
          return await channel.send(this.toPayload(extra));
        } catch {
          const fallbackEmbed = this.getFallbackEmbed();
          return await channel.send({ embeds: [fallbackEmbed], ...extra }).catch(() => null);
        }
      }
    }

    async edit(target, extra = {}) {
      return await target.edit(this.toPayload(extra)).catch(() => null);
    }
  };
};
