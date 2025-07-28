// controllers/admin/adminOrderController.js
import { ObjectId } from "mongodb";

export const getAllOrders = (orders, users) => async (req, res) => {
  try {
    const { page = 1, limit = 10, status, isPaid, user } = req.query;

    const matchStage = {};
    if (status) matchStage.orderStatus = status;
    if (isPaid !== undefined) matchStage.isPaid = isPaid === "true";
    if (user) matchStage.user = new ObjectId(user);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          items: 1,
          shippingAddress: 1,
          paymentMethod: 1,
          totalAmount: 1,
          orderStatus: 1,
          paymentStatus: 1,
          isPaid: 1,
          createdAt: 1,
          updatedAt: 1,
          userEmail: "$userDetails.email", // 💡 Attach email here
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ];

    const ordersList = await orders.aggregate(pipeline).toArray();

    const total = await orders.countDocuments(matchStage);

    res.status(200).json({
      data: ordersList,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Error fetching admin orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};
