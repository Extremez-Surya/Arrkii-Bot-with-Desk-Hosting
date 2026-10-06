/** @format */

const Noprefix = require("../../schema/noprefix");
const VoteBypassUser = require("../../schema/votebypassuser");
const cleanExpiredPermissions = async (client) => {
  try {
    const now = new Date();

    // Handle expired NoPrefix entries
    const expiredNoprefix = await Noprefix.find({ expiresAt: { $lt: now } });
    for (const entry of expiredNoprefix) {
      try {
        const user = await client.users.fetch(entry.userId);
        if (user) {
          await user.send(
            `⚠️ Hello **${user.username}**, your **NoPrefix Premium** has expired. Please renew to continue using the feature.`,
          );
        }
        console.log(
          `[Handler] Notified user ${entry.userId} about NoPrefix expiration.`,
        );
      } catch (error) {
        console.warn(
          `[Handler] Could not notify user ${entry.userId}:`,
          error.message,
        );
      }

      await Noprefix.deleteOne({ _id: entry._id });
      console.log(
        `[Handler] Removed expired NoPrefix for user ${entry.userId}.`,
      );
    }

    // Handle expired VoteBypass entries
    const expiredVoteBypass = await VoteBypassUser.find({
      expiresAt: { $lt: now },
    });
    for (const entry of expiredVoteBypass) {
      try {
        const user = await client.users.fetch(entry.userId);
        if (user) {
          await user.send(
            `⚠️ Hello **${user.username}**, your **Vote Bypass** access has expired. Please vote again to regain access.`,
          );
        }
        console.log(
          `[Handler] Notified user ${entry.userId} about VoteBypass expiration.`,
        );
      } catch (error) {
        console.warn(
          `[Handler] Could not notify user ${entry.userId}:`,
          error.message,
        );
      }

      await VoteBypassUser.deleteOne({ _id: entry._id });
      console.log(
        `[Handler] Removed expired VoteBypass for user ${entry.userId}.`,
      );
    }
  }catch (error) {
}
  };

/**
 * Initializes periodic cleanup task.
 * @param {Object} client - The Discord.js client instance.
 */
const initializeCleanup = (client) => {
  if (!client) {
    console.error(
      "[Handler] Discord client is required to initialize the cleanup handler.",
    );
    return;
  }

  setInterval(() => cleanExpiredPermissions(client), 60 * 1000); // Run every 1 minute
  console.log("[Handler] Permission cleanup handler initialized.");
};

module.exports = initializeCleanup;
