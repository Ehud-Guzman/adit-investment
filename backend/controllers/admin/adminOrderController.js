// controllers/admin/adminOrderController.js
import Order from "../../models/Order.js";

/**
 * 🧠 GET /api/admin/orders
 * Fetch all orders with optional filters and pagination.
 */
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, isPaid, user } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (isPaid !== undefined) query.isPaid = isPaid === "true";
    if (user) query.user = user;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      data: orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Error fetching admin orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};
