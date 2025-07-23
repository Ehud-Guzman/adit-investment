import { ObjectId } from "mongodb";

export default function CartController(cart) {
  // 🧼 Enhanced normalization with consistent ID handling
 const normalizeCartItems = (items) =>
  items.map((item) => ({
    ...item,
    id: item._id?.toString?.() || item.id,
    _id: item._id?.toString?.(), // force string always
    productId: item.productId?.toString?.(),
  }));


  return {
    // 📦 GET /cart
    getUserCart: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized: Missing user" });

      try {
        const items = await cart.find({ userId }).toArray();
        res.status(200).json(normalizeCartItems(items));
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
      }
    },

    // ➕ POST /cart
    addToCart: async (req, res) => {
      const userId = req.user?.userId;
      const { productId, quantity = 1 } = req.body;

      if (!userId || !productId || typeof productId !== "string" || !ObjectId.isValid(productId)) {
        return res.status(400).json({ message: `Invalid or missing productId: ${productId}` });
      }

      try {
        const existing = await cart.findOne({ userId, productId });

        if (existing) {
          await cart.updateOne({ userId, productId }, { $inc: { quantity } });
        } else {
          await cart.insertOne({ userId, productId, quantity, createdAt: new Date() });
        }

        const updatedCart = await cart.find({ userId }).toArray();
        res.status(200).json(normalizeCartItems(updatedCart));
      } catch (err) {
        res.status(500).json({ message: "Failed to add to cart", error: err.message });
      }
    },

    // ✏️ PATCH /cart/:id
    updateItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { quantity } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      try {
        const result = await cart.updateOne(
          { _id: new ObjectId(id), userId },
          { $set: { quantity } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        const updatedCart = await cart.find({ userId }).toArray();
        res.status(200).json(normalizeCartItems(updatedCart));
      } catch (err) {
        res.status(500).json({ message: "Failed to update item", error: err.message });
      }
    },

    // ❌ FIXED: DELETE /cart/:id with proper normalization
      removeItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Missing user ID" });
      }

      if (!ObjectId.isValid(id)) {
        console.warn("🛑 Invalid cart item ID received:", id);
        const fallbackCart = await cart.find({ userId }).toArray();
        return res.status(200).json(normalizeCartItems(fallbackCart)); // ✅ Fixed normalization
      }

      try {
        const result = await cart.deleteOne({ _id: new ObjectId(id), userId });

        if (result.deletedCount === 0) {
          console.warn(`⚠️ No cart item found to delete: ${id} for user ${userId}`);
          return res.status(404).json({ message: "Cart item not found" });
        }

        const updatedCart = await cart.find({ userId }).toArray();
        return res.status(200).json(normalizeCartItems(updatedCart)); // ✅ Fixed normalization
      } catch (err) {
        console.error("❌ Failed to remove item from cart:", err.message);
        return res.status(500).json({
          message: "Failed to remove item",
          error: err.message,
        });
      }
    },

    // 🔄 POST /cart/merge
mergeGuestCart: async (req, res) => {
  const userId = req.user?.userId;
  const items = req.body?.items || [];

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid items payload" });

  try {
    const bulkOps = [];

    for (const { productId, quantity } of items) {
      if (!productId || typeof productId !== "string") continue;
      const qty = Math.max(Number(quantity) || 1, 1);

      const existing = await cart.findOne({ userId, productId });

      if (existing) {
        bulkOps.push({
          updateOne: {
            filter: { userId, productId },
            update: { $inc: { quantity: qty } },
          },
        });
      } else {
        bulkOps.push({
          insertOne: {
            document: {
              userId,
              productId,
              quantity: qty,
              createdAt: new Date(),
            },
          },
        });
      }
    }

    if (bulkOps.length) {
      await cart.bulkWrite(bulkOps);
    }

    const updatedCart = await cart.find({ userId }).lean(); // ✅ FIXED

    const normalized = normalizeCartItems(updatedCart);

    res.status(200).json({ success: true, items: normalized });
  } catch (err) {
    console.error("❌ Merge cart failed:", err.message);
    res.status(500).json({ message: "Failed to merge guest cart", error: err.message });
  }
}
  };
}
