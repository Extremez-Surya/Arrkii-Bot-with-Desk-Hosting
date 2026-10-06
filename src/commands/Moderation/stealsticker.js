const { EmbedBuilder } = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
  name: "stealsticker",
  category: "Moderation",
  aliases: ["addsticker", "stealsticker", "ss"],
  description: "Adds a sticker from a replied message to the server.",
  args: false,
  userPerms: ["ManageEmojisAndStickers"],
  execute: async (message, args, client, prefix) => {
    if (!message.member.permissions.has("ManageEmojisAndStickers")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | You must have \`Manage Emojis and Stickers\` permissions to use this command.`,
            ),
        ],
      });
    }

    if (!message.guild.members.me.permissions.has("ManageEmojisAndStickers")) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.cross} | I need \`Manage Emojis and Stickers\` permissions to perform this action.`,
            ),
        ],
      });
    }

    // Check if the message is a reply
    if (!message.reference) {
      return message.reply("Please reply to a message containing a sticker.");
    }

    // Fetch the referenced message
    const referencedMessage = await message.channel.messages.fetch(
      message.reference.messageId,
    );

    // Check if the referenced message contains a sticker
    if (!referencedMessage.stickers.size) {
      return message.reply("The replied message does not contain a sticker.");
    }

    // Extract the sticker details
    const sticker = referencedMessage.stickers.first();
    const stickerURL = `https://media.discordapp.net/stickers/${sticker.id}.png`;
    const stickerName = sticker.name; // Preserve the original name

    // Validate sticker URL
    try {
      await axios.head(stickerURL);

      // Add the sticker to the server
      message.guild.stickers
        .create({
          file: stickerURL,
          name: stickerName,
          tags: sticker.tags || "fun",
        }) // Modify tags as needed
        .then((newSticker) => {
          const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `${client.emoji.tick} | Successfully added the sticker **${newSticker.name}**.`,
            );
          message.channel.send({ embeds: [embed] });
        })
        .catch((error) => {
          console.error(error);
          message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${client.emoji.cross} | I couldn't add the sticker. Possible reasons: \`Sticker slots full\`, \`Invalid URL\`, \`Server limit reached\`.`,
                ),
            ],
          });
        });
    } catch (error) {
      console.error(error);
      message.reply("The sticker could not be accessed or is invalid.");
    }
  },
};
