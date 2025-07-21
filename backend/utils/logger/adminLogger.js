// utils/logger/adminLogger.js
import { ObjectId } from "mongodb";

export const logAdminAction = async (db, {
  action,                // e.g. "promote_user", "delete_user"
  performedBy,           // admin user ID (string)
  targetUserId,          // affected user ID (string)
  metadata = {},         // optional — e.g. { previousStatus: "active", newStatus: "locked" }
  description = "",      // optional human-readable log
}) => {
  try {
    const log = {
      action,
      performedBy: new ObjectId(performedBy),
      targetUserId: new ObjectId(targetUserId),
      metadata,
      description,
      timestamp: new Date(),
    };

    await db.collection("adminLogs").insertOne(log);
  } catch (err) {
    console.error("❌ Failed to log admin action:", err);
    // Logging should never break your main action
  }
};
