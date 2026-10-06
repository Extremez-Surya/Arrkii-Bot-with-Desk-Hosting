/** @format
 *
 * Astrix By Ozuma xd
 * © 2024 Astrix Development
 *
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "restart",
  category: "Owner",
  owner: true,
  execute: async (message, args, client) => {
    const playingGuilds = [...client.manager.players]
      .map((e) => e[1])
      .filter((p) => p.playing)
      .map((p) => p.guildId);

    const guilds = [];
    for (const id of playingGuilds) {
      const guild = client.guilds.cache.get(id);
      if (guild) {
        guilds.push(
          `${guild.name.substring(0, 15)} | Members: ${guild.memberCount}\n`,
        );
      }
    }

    const description =
      guilds.length === 0
        ? `___Currently playing in 0 servers\n\nDo you wish to restart?___`
        : `___Currently playing in:___ \n\n${guilds.join("")}`;

    const embed = new client.embed()
      .setColor(client.color || "#ff0000")
      //.setTitle("Restart Confirmation")
      .setDescription(description);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("restart")
        .setLabel("Restart Bot")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),
    );

    const msg = await message.reply({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => {
        if (interaction.user.id === message.author.id) return true;
        interaction.reply({
          content: "You can't use this button.",
          ephemeral: true,
        });
        return false;
      },
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      if (interaction.customId === "restart") {
        await msg.edit({
          embeds: [
            new client.embed().setDescription(
              "🔄 Restarting all shards... ETA: 10-15s",
            ),
          ],
          components: [],
        }).catch(() => {});

        console.log("Restarting all shards...");
        await client.cluster.respawnAll(); 
      } else if (interaction.customId === "cancel") {
        collector.stop();
        await msg.edit({
          embeds: [
            new client.embed().setDescription(
              "❌ Restart operation cancelled.",
            ),
          ],
          components: [],
        }).catch(() => {});
      }
    });
  },
};
