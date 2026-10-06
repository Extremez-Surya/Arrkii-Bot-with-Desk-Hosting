/** @format */

const { Kazagumo, Plugins, KazagumoTrack } = require("kazagumo");
const { Connectors, LoadType, Player, RestError, Rest } = require("shoukaku");

// Patch Rest.prototype.updatePlayer to ensure voice updates always include channelId required by Lavalink v4
if (Rest && Rest.prototype && !Rest.prototype._originalUpdatePlayer) {
  Rest.prototype._originalUpdatePlayer = Rest.prototype.updatePlayer;
  Rest.prototype.updatePlayer = async function (data) {
    if (data?.playerOptions?.voice && !data.playerOptions.voice.channelId) {
      const conn = this.node?.manager?.connections?.get(data.guildId);
      if (conn?.channelId) {
        data.playerOptions.voice.channelId = conn.channelId;
      }
    }
    return this._originalUpdatePlayer(data);
  };
}

// Patch Player.prototype.sendServerUpdate to include channelId required by Lavalink v4
if (Player && Player.prototype && !Player.prototype._originalSendServerUpdate) {
  Player.prototype._originalSendServerUpdate = Player.prototype.sendServerUpdate;
  Player.prototype.sendServerUpdate = async function (connection) {
    if (
      !connection ||
      !connection.serverUpdate ||
      !connection.serverUpdate.token ||
      !connection.serverUpdate.endpoint ||
      !connection.sessionId
    ) {
      return;
    }
    const playerUpdate = {
      guildId: this.guildId,
      playerOptions: {
        voice: {
          token: connection.serverUpdate.token,
          endpoint: connection.serverUpdate.endpoint,
          sessionId: connection.sessionId,
          channelId: connection.channelId || connection.lastChannelId || null,
        },
      },
    };
    return await this.node.rest.updatePlayer(playerUpdate);
  };
}

const searchEngines = {
  DEEZER: "dzsearch",
  SPOTIFY: "spsearch",
  YOUTUBE: "ytsearch",
  JIO_SAAVAN: "jssearch",
  SOUNDCLOUD: "scsearch",
  YOUTUBE_MUSIC: "ytmsearch"
};

module.exports = function loadPlayerManager(client) {
  const manager = new Kazagumo(
    {
      defaultSearchEngine: client.config.node_source,
      send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild?.shard) guild.shard.send(payload);
      }
    },
    new Connectors.DiscordJS(client),
    client.config.nodes,
    client.config.node_options
  );

  // Ensure packets are always dispatched via the guild's shard
  if (manager.shoukaku?.connector?.sendPacket) {
    const originalSendPacket = manager.shoukaku.connector.sendPacket.bind(manager.shoukaku.connector);
    manager.shoukaku.connector.sendPacket = function (shardId, payload, important) {
      if (payload?.d?.guild_id) {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild?.shard) {
          return guild.shard.send(payload, important);
        }
      }
      return originalSendPacket(shardId, payload, important);
    };
  }

  // Auto-inject guild shardId into createPlayer if not provided
  const originalCreatePlayer = manager.createPlayer.bind(manager);
  manager.createPlayer = async function (options) {
    if (options && (options.shardId === undefined || isNaN(options.shardId)) && options.guildId) {
      const guild = client.guilds.cache.get(options.guildId);
      if (guild && typeof guild.shardId === "number") {
        options.shardId = guild.shardId;
      }
    }
    return originalCreatePlayer(options);
  };

  // Attach the searchEngines enum to manager
  manager.searchEngines = searchEngines;

  // Also manually store the default search engine
  manager.defaultSearchEngine = client.config.node_source;

  // Override the search method
  manager.search = async function (query, options = {}) {
    const prefix = options.engine || this.defaultSearchEngine;

    const node = [...this.shoukaku.nodes.values()][0];
    if (!node) return { type: "SEARCH", tracks: [] };

    const isUrl = /^https?:\/\//.test(query);

    const searchQuery = isUrl ? query : `${prefix}:${query}`;

    const res = await node.rest.resolve(searchQuery).catch(() => null);

    if (!res) return { type: "SEARCH", tracks: [] };

    switch (res.loadType) {
      case LoadType.TRACK:
        return {
          type: "TRACK",
          tracks: [new KazagumoTrack(res.data, options.requester)]
        };
      case LoadType.PLAYLIST:
        return {
          type: "PLAYLIST",
          playlistName: res.data.info.name,
          tracks: res.data.tracks.map((track) => new KazagumoTrack(track, options.requester))
        };
      case LoadType.SEARCH:
        return {
          type: "SEARCH",
          tracks: res.data.map((track) => new KazagumoTrack(track, options.requester))
        };
      default:
        return { type: "SEARCH", tracks: [] };
    }
  };

  client.manager = manager;
  return manager;
};
