/** @format */

require("dotenv").config();

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
      return true;
    default:
      return false;
  }
}

const lavalinkHost = process.env.LAVALINK_HOST || process.env.NODE_HOST;
const lavalinkPort = process.env.LAVALINK_PORT || process.env.NODE_PORT;
const lavalinkUrl =
  lavalinkHost && lavalinkPort
    ? `${lavalinkHost}:${lavalinkPort}`
    : process.env.LAVALINK_URL || process.env.NODE_URL || "lavalinkv4.serenetia.com:443";

const lavalinkAuth =
  process.env.LAVALINK_PASSWORD ||
  process.env.LAVALINK_AUTH ||
  process.env.NODE_AUTH ||
  "https://seretia.link/discord";

const lavalinkSecure =
  process.env.LAVALINK_SECURE !== undefined
    ? parseBoolean(process.env.LAVALINK_SECURE)
    : process.env.NODE_SECURE !== undefined
    ? parseBoolean(process.env.NODE_SECURE)
    : true;

module.exports = {
  token:
    process.env.DISCORD_TOKEN ||
    process.env.TOKEN ||
    "",
  clientId: process.env.CLIENT_ID || "",
  prefix: process.env.PREFIX || ">",
  ownerID: process.env.OWNER_ID || process.env.OWNER_IDS || "984409270344908872",
  SpotifyID:
    process.env.SPOTIFY_CLIENT_ID ||
    process.env.SPOTIFY_ID ||
    "",
  SpotifySecret:
    process.env.SPOTIFY_CLIENT_SECRET ||
    process.env.SPOTIFY_SECRET ||
    "",
  mongourl:
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    "",
  embedColor: process.env.EMBED_COLOR || "#2f3136",
  logs:
    process.env.WEBHOOK_LOGS ||
    process.env.LOGS_WEBHOOK ||
    process.env.WEBHOOK_URL ||
    "",
  node_source: process.env.NODE_SOURCE || "ytsearch",
  topgg: process.env.TOPGG_TOKEN || "here",
  links: {
    BG:
      process.env.LINK_BG ||
      "https://cdn.discordapp.com/attachments/1061636453437804544/1186002755924525166/20231217_232106.jpg",
    support: process.env.SUPPORT_SERVER_URL || "https://discord.gg/yVxV7AxDBB",
    invite:
      process.env.INVITE_URL ||
      "https://discord.com/api/oauth2/authorize?client_id=1399186967966519326&permissions=824671333721&scope=bot",
    astrix:
      "https://cdn.discordapp.com/attachments/1187323477032697867/1236626903847407696/Astrix.gif",
    power: "Powered By Astrix Development 🌙",
    vanity: process.env.VANITY_URL || "discord.gg/yVxV7AxDBB",
    guild: process.env.GUILD_ID || "1325384856477368420",
    topgg: "https://top.gg/bot/1033496708992204840/vote",
  },
  Webhooks: {
    black: process.env.WEBHOOK_BLACK || "",
    player_create: process.env.WEBHOOK_PLAYER_CREATE || "",
    player_delete: process.env.WEBHOOK_PLAYER_DELETE || "",
    guild_join: process.env.WEBHOOK_GUILD_JOIN || "",
    guild_leave: process.env.WEBHOOK_GUILD_LEAVE || "",
    cmdrun: process.env.WEBHOOK_CMDRUN || "",
  },

  nodes: [
    {
      url: lavalinkUrl,
      name: process.env.NODE_NAME || "Lavalink",
      auth: lavalinkAuth,
      secure: lavalinkSecure,
    },
  ],
};
