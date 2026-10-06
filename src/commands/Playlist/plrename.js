const db = require("../../schema/playlist");

module.exports = {
  name: "plrename",
  aliases: ["plrename", "plr"],
  category: "Playlist",
  cooldown: 5,
  description: "Renames an existing playlist.",
  args: true,
  usage: "<old_name> <new_name>",
  userPrams: [],
  botPrams: ["EMBED_LINKS"],
  owner: false,
  player: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {
    // Validate input
    if (args.length < 2) {
      return message.reply({
        embeds: [
          new client.embed().setDescription(
            "**Please provide both the current name and the new name of the playlist!**",
          ),
        ],
      });
    }

    const oldName = args[0].replace(/_/g, " ").trim();
    const newName = args.slice(1).join(" ").trim();
    const userId = message.author.id;

    // Validate new name length
    if (newName.length > 50) {
      return message.reply({
        embeds: [
          new client.embed().setDescription(
            "**The new playlist name cannot exceed 50 characters.**",
          ),
        ],
      });
    }

    try {
      // Check if the playlist with the old name exists
      const playlist = await db.findOne({
        UserId: userId,
        PlaylistName: oldName, // Case-insensitive search
      });

      if (!playlist) {
        return message.reply({
          embeds: [
            new client.embed().setDescription(
              `**No playlist named "${oldName}" found in your collection.**`,
            ),
          ],
        });
      }

      // Check if the new name is already taken
      const duplicate = await db.findOne({
        UserId: userId,
        PlaylistName: newName, // Case-insensitive search
      });

      if (duplicate) {
        return message.reply({
          embeds: [
            new client.embed().setDescription(
              `**A playlist named "${newName}" already exists.**`,
            ),
          ],
        });
      }

      // Rename the playlist
      playlist.PlaylistName = newName;
      await playlist.save();

      return message.reply({
        embeds: [
          new client.embed().setDescription(
            `**Playlist "${oldName}" has been renamed to "${newName}".**`,
          ),
        ],
      });
    } catch (error) {
      console.error("Error renaming playlist:", error);
      return message.reply({
        embeds: [
          new client.embed().setDescription(
            "**An error occurred while renaming the playlist. Please try again later.**",
          ),
        ],
      });
    }
  },
};
