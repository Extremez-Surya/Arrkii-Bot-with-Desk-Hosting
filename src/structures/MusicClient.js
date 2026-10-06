/** @format */

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Kazagumo, Plugins } = require("kazagumo");
const mongoose = require("mongoose");
const { readdirSync, existsSync } = require("fs");
const { Connectors } = require("shoukaku");
const Spotify = require("kazagumo-spotify");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const { AutoPoster } = require("topgg-autoposter");
const loadPlayerManager = require("../loaders/loadPlayerManager");
const permissionHandler = require("../events/Client/PremiumChecks");

const ShoukakuOptions = {
  moveOnDisconnect: false,
  resume: false,
  resumeTimeout: 30,
  reconnectTries: 2,
  restTimeout: 10000,
  userAgent: "Astrix",
};

class MusicBot extends Client {
  constructor() {
    super({
      intents: 33779,
      properties: {
        browser: "Discord Android",
      },
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      failIfNotExists: false,
      shards: getInfo().SHARD_LIST || [0],
      shardCount: getInfo().TOTAL_SHARDS || 1,
    });

    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.config = require("../config.js");
    this.owner = this.config.ownerID;
    this.prefix = this.config.prefix;
    this.topgg = this.config.topgg;
    this.embedColor = this.config.embedColor;
    this.button = require("../custom/button.js");
    this.embed = require("../custom/embed.js")(this.embedColor);
    this.container = require("../custom/container.js")(this);
    require("../custom/numformat")(this);
    this.aliases = new Collection();
    this.logger = require("../utils/logger.js");
    this.emoji = require("../utils/emoji.json");
    this.cluster = new ClusterClient(this);
    if (!this.token) this.token = this.config.token;
    this.manager = null;
    this.spamMap = new Map();
    this.cooldowns = new Collection();

    this._connectMongodb();
    this._initAutoPoster();
    //this._loadPlayer();
    permissionHandler(this);
    loadPlayerManager(this);
    [
      "loadAntinukes",
      "loadAutoMods",
      "loadClients",
      "loadCommands",
      "loadNodes",
      "loadSlashCommands",
      "loadPlayers",
    ].forEach((handler) => {
      require(`../loaders/${handler}`)(this);
    });
  }
  async _connectMongodb() {
    const dbOptions = {
      autoIndex: false,
      connectTimeoutMS: 1000,
      family: 4,
    };

    mongoose.set("strictQuery", false);
    mongoose.connect(this.config.mongourl, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      this.logger.log("[DB] Database connected", "ready");
    });

    mongoose.connection.on("err", (err) => {
      this.logger.log(`[DB] Mongoose connection error: ${err.stack}`, "error");
    });

    mongoose.connection.on("disconnected", () => {
      this.logger.log("[DB] Mongoose disconnected", "error");
    });
  }

  _initAutoPoster() {
    const topggToken = this.config.topgg;
    if (!topggToken || topggToken === "here") {
      return;
    }

    AutoPoster(topggToken, this)
      .on("posted", () => {
        this.logger.log("Posted stats to top.gg!", "ready");
      })
      .on("error", (err) => {
        this.logger.log(`Error posting stats to top.gg: ${err}`, "error");
      });
  }
  connect() {
    return super.login(this.token);
  }
}

module.exports = MusicBot;
