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

// 🧾 Secure: Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user?.userId;


  // Validate user and items
  if (!userId || typeof userId !== "string" || !ObjectId.isValid(userId)) {
    console.warn("⚠️ Invalid or missing user ID:", userId);
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    console.warn("⚠️ Order must contain at least one item.");
    res.status(400);
    throw new Error("Order must contain at least one valid item.");
  }

  const validatedItems = [];
  let totalAmount = 0;

  for (const [index, item] of items.entries()) {
    const { productId, quantity } = item;

    // Validate productId
    if (!productId || !ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error(`Invalid productId at index ${index}: ${productId}`);
    }

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 1) {
      res.status(400);
      throw new Error(`Invalid quantity at index ${index}: ${quantity}`);
    }

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${productId}`);
    }

    const price = product.discountPrice ?? product.price;
    if (typeof price !== "number" || price < 0) {
      res.status(400);
      throw new Error(`Invalid pricing for product: ${product.title || productId}`);
    }

    validatedItems.push({
      productId: product._id,
      title: product.title || product.name || "Unknown Product",

      image: product.images?.[0] || "",
      quantity,
      price,
    });

    totalAmount += price * quantity;
  }

  const order = {
    user: new ObjectId(userId),
    items: validatedItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    orderStatus: "processing",
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

  if (!userId || typeof userId !== "string" || !ObjectId.isValid(userId)) {
    console.warn("⚠️ Invalid user ID for user order fetch:", userId);
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const orders = await ordersCollection
    .find({ user: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

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

  const update = {
    orderStatus: status,
    updatedAt: new Date(),
  };

  if (status === "shipped") update.shippedAt = new Date();
  if (status === "delivered") update.deliveredAt = new Date();

  const result = await ordersCollection.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: update }
  );

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

  if (paymentStatus === "paid") update.paidAt = new Date();

  const result = await ordersCollection.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: update }
  );

  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, message: `Payment marked as '${paymentStatus}'` });
});

// ❌ Cancel order (user or admin)
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "processing") {
    res.status(400);
    throw new Error("Only 'processing' orders can be cancelled.");
  }

  await ordersCollection.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        orderStatus: "cancelled",
        updatedAt: new Date(),
      },
    }
  );

  res.json({ success: true, message: "Order has been cancelled." });
});
