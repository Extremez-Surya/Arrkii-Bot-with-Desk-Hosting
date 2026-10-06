/** @format */

const { EmbedBuilder } = require("discord.js");

module.exports = (color = "#2b2d31") => {
  class embed extends EmbedBuilder {
    constructor() {
      super({});
      this.setColor(color || "#2b2d31");
      return this;
    }
    t = (title) => {
      this.setTitle(title);
      return this;
    };
    d = (text) => {
      this.setDescription(text);
      return this;
    };
    container = (title, ...lines) => {
      const header = title ? `### ${title}\n` : "";
      const body = lines.filter(Boolean).map(l => `> ${l}`).join("\n");
      this.setDescription(`${header}${body}`);
      return this;
    };
    thumb = (url) => {
      this.setThumbnail(url);
      return this;
    };
    img = (uri) => {
      this.setImage(uri);
      return this;
    };
    a = (text, icon) => {
      this.setAuthor({ name: text, iconURL: icon });
      return this;
    };
    f = (text, icon) => {
      this.setFooter({ text: text, iconURL: icon });
      return this;
    };
  }
  return embed;
};
