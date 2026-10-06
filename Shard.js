/** @format
 *
 * Astrix Music Bot
 *
 */

require("dotenv").config();
const config = require("./src/config");
const { ClusterManager } = require("discord-hybrid-sharding");
[
  {
    file: "./index.js",
    token: config.token,
    shards: 1,
    perCluster: 1,
  },
].forEach((client) => {
  new ClusterManager(client.file, {
    restarts: {
      max: 5,
      interval: 1000,
    },
    respawn: true,
    mode: "process",
    token: client.token,
    totalShards: client.shards || "auto",
    shardsPerClusters: parseInt(client.perCluster) || 2,
  })
    .on("clusterCreate", (cluster) => {
      console.log(`Launched cluster ${cluster.id}`);
    })
    .on("debug", (info) => {
      console.log(`${info}`, "cluster");
    })
    .spawn({ timeout: -1 });
});
