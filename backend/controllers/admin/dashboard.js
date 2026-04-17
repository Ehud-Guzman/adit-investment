// controllers/admin/dashboard.js
import { excludeDeleted } from "../../config/db.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");
    const reviewsCollection = db.collection("reviews");
    const logsCollection = db.collection("adminLogs");

    // const ordersCollection = db.collection("orders"); // Phase 3

    const [totalUsers, totalProducts, totalReviews, rolesAggregation, latestLogs] =
      await Promise.all([
        usersCollection.countDocuments(excludeDeleted()),
        productsCollection.countDocuments(excludeDeleted()),
        reviewsCollection.countDocuments(excludeDeleted()),
        usersCollection.aggregate([
          { $match: excludeDeleted() },
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ]).toArray(),
        logsCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .project({ _id: 0, adminId: 1, action: 1, target: 1, createdAt: 1 })
          .toArray(),
      ]);

    const roleCounts = rolesAggregation.reduce((acc, { _id, count }) => {
      acc[_id || "unknown"] = count;
      return acc;
    }, {});

    res.status(200).json({
      totalUsers,
      totalAdmins: roleCounts["admin"] || 0,
      totalProducts,
      totalReviews,
      roleCounts,
      latestLogs, // 🔥 Send recent logs to frontend
    });
  } catch (err) {
    console.error("💥 Dashboard Overview Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
};
