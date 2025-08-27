// controllers/orderController.js

import asyncHandler from "express-async-handler";
import { ObjectId } from "mongodb";

let ordersCollection;
let productsCollection;

// 🔌 Inject DB collections at app startup
export const injectCollections = (collections) => {
  if (!collections.orders || !collections.products) {
    console.error("❌ Missing orders/products collections.");
    throw new Error("Required collections not provided.");
  }
  ordersCollection = collections.orders;
  productsCollection = collections.products;
};

// 🧾 Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user?.userId;

  if (!userId || !ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Order must contain at least one valid item.");
  }

  const rawIds = items.map((it, idx) => {
    const { productId, quantity } = it ?? {};
    if (!productId || !ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error(`Invalid productId at index ${idx}: ${productId}`);
    }
    if (typeof quantity !== "number" || quantity < 1) {
      res.status(400);
      throw new Error(`Invalid quantity at index ${idx}: ${quantity}`);
    }
    return productId;
  });

  const uniqueObjectIds = [...new Set(rawIds)].map((id) => new ObjectId(id));
  const foundProducts = await productsCollection.find({ _id: { $in: uniqueObjectIds } }).toArray();
  const productMap = new Map(foundProducts.map((p) => [p._id.toString(), p]));

  for (const [idx, pid] of rawIds.entries()) {
    if (!productMap.has(pid)) {
      res.status(404);
      throw new Error(`Product not found: ${pid} (at index ${idx})`);
    }
  }

  const validatedItems = [];
  let totalAmount = 0;

  for (const [index, { productId, quantity }] of items.entries()) {
    const product = productMap.get(productId);
    const basePrice = typeof product.discountPrice === "number" ? product.discountPrice : product.price;

    if (typeof basePrice !== "number" || basePrice < 0) {
      res.status(400);
      throw new Error(`Invalid pricing for product: ${product?.title || product?.name || productId} (at index ${index})`);
    }

    validatedItems.push({
      productId: product._id,
      title: product.title || product.name || "Unknown Product",
      image: Array.isArray(product.images) ? (product.images[0] || "") : "",
      quantity,
      price: basePrice,
    });

    totalAmount += basePrice * quantity;
  }

  const order = {
    user: new ObjectId(userId),
    items: validatedItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    orderStatus: "pending",      // ✅ Pending at creation
    paymentStatus: "pending",
    isPaid: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await ordersCollection.insertOne(order);
  console.log("✅ Order inserted:", result.insertedId);

  res.status(201).json({
    success: true,
    message: "✅ Order placed successfully.",
    orderId: result.insertedId,
  });
});

// 📦 Admin: Get all orders
export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await ordersCollection
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          user: "$userInfo._id",
          userName: "$userInfo.name",
          userEmail: "$userInfo.email",
          items: 1,
          shippingAddress: 1,
          paymentMethod: 1,
          totalAmount: 1,
          orderStatus: 1,
          paymentStatus: 1,
          isPaid: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();

  res.json({ success: true, count: orders.length, orders });
});

// 👤 User: Get own orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId || !ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const orders = await ordersCollection.find({ user: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, count: orders.length, orders });
});

// 🔄 Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const update = { orderStatus: status, updatedAt: new Date() };
  if (status === "shipped") update.shippedAt = new Date();
  if (status === "delivered") update.deliveredAt = new Date();

  const result = await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: update });
  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, message: `Order marked as '${status}'` });
});

// 💳 Admin: Update payment status
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  if (!ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const validStatuses = ["pending", "paid", "failed", "refunded"];
  if (!validStatuses.includes(paymentStatus)) {
    res.status(400);
    throw new Error("Invalid payment status");
  }

  const update = {
    paymentStatus,
    isPaid: paymentStatus === "paid",
    updatedAt: new Date(),
  };

  if (paymentStatus === "paid") {
    update.paidAt = new Date();
    update.orderStatus = "processing";   // ✅ auto move to processing
  }

  const result = await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: update });
  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, message: `Payment marked as '${paymentStatus}'` });
});

// 🗑️ Cancel order (user/admin)
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role || "user";

  if (!ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== userId && userRole !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  if (["processing", "shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
    res.status(400);
    throw new Error(`Order cannot be cancelled once it is '${order.orderStatus}'.`);
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("This order has already been paid and cannot be cancelled directly.");
  }

  await ordersCollection.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { orderStatus: "cancelled", updatedAt: new Date() } }
  );

  res.json({ success: true, message: "Order has been cancelled." });
});

// 👤 Get single order by ID (user or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role || "user";

  if (!ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await ordersCollection.aggregate([
    { $match: { _id: new ObjectId(orderId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 1,
        user: "$userInfo._id",
        userName: "$userInfo.name",
        userEmail: "$userInfo.email",
        items: 1,
        shippingAddress: 1,
        paymentMethod: 1,
        totalAmount: 1,
        orderStatus: 1,
        paymentStatus: 1,
        isPaid: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]).toArray();

  if (!order[0]) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only owner or admin can view
  if (order[0].user.toString() !== userId && userRole !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order: order[0] });
});
