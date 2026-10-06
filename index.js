const { Collection } = require("discord.js");
const MusicBot = require("./src/structures/MusicClient");
const initializeCleanup = require("./src/events/Client/PremiumChecks");
const Dokdo = require("dokdo");
const client = new MusicBot();
const util = require("./src/utils/util");

client.util = new util(client);
module.exports = client;
client.connect();

client.Jsk = new Dokdo.Client(client, {
  aliases: ["dokdo", "dok", "jsk"],
  prefix: "?",
  owners: ["984409270344908872", client.config.ownerID],
});

process.env.SHELL = process.platform === "win32" ? "powershell" : "bash";

client.userSettings = new Collection();
client.color = "2b2d31";
client.emoji = require("./src/utils/emoji.json");

const { Api } = require("@top-gg/sdk");
client.topgg = new Api(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMzM0OTY3MDg5OTIyMDQ4NDAiLCJib3QiOnRydWUsImlhdCI6MTczNTgxNjQ3OH0.J6DEdwViWOgYqHJ1Y9NoFgmVRbfSRoLFLfl0TG-j7es",
);

client.on("messageCreate", (message) => {
  client.Jsk.run(message);
});

const isIgnorableDiscordError = (err) => {
  if (!err) return false;
  if ((err.name === "RestError" || err.constructor?.name === "RestError") && (err.status === 400 || err.status === 404)) return true;
  const ignorableCodes = [10008, 10062, 40060, 50007, 50013];
  if (ignorableCodes.includes(err.code) || ignorableCodes.includes(err.rawError?.code)) return true;
  if (err.message && (err.message.includes("Unknown Message") || err.message.includes("Unknown interaction") || err.message.includes("Missing Permissions"))) return true;
  return false;
};

process.on("unhandledRejection", (reason, p) => {
  if (isIgnorableDiscordError(reason)) return;
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  if (isIgnorableDiscordError(err)) return;
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  if (isIgnorableDiscordError(err)) return;
  console.log(err, origin);
});

//
