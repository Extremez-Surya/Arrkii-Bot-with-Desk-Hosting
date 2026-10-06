const { MessageFlags, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  cooldown: 5,
  category: "Information",
  execute: async (message, args, client, prefix) => {
    const start = Date.now();
    const restPing = Math.abs(Date.now() - message.createdTimestamp) || client.ws.ping;
    const container = new client.container(0x2b2d31)
      .text(
        `### 🏓 Pong!\n` +
        `> • **Gateway Latency:** \`${client.ws.ping}ms\`\n` +
        `> • **REST Latency:** \`${restPing}ms\`\n` +
        `> \n` +
        `> -# Astrix • Minimal & Fast`
      );

    try {
      return await message.reply(container.toPayload());
    } catch {
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2b2d31")
            .setDescription(
              `### 🏓 Pong!\n> • **Gateway Latency:** \`${client.ws.ping}ms\`\n> • **REST Latency:** \`${restPing}ms\``
            ),
        ],
      });
    }
  },
};
