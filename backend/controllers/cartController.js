import { ObjectId } from 'mongodb';

export default function CartController(cart) {
  return {
    getUserCart: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Missing user" });
      }

      try {
        const items = await cart.find({ userId }).toArray();
        res.status(200).json(items);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch cart", error: err.message });
      }
    },

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
        res.status(200).json(updatedCart);
      } catch (err) {
        res.status(500).json({ message: "Failed to add to cart", error: err.message });
      }
    },

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
        res.status(200).json(updatedCart);
      } catch (err) {
        res.status(500).json({ message: "Failed to update item", error: err.message });
      }
    },

    removeItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      try {
        const result = await cart.deleteOne({ _id: new ObjectId(id), userId });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        const updatedCart = await cart.find({ userId }).toArray();
        res.status(200).json(updatedCart);
      } catch (err) {
        res.status(500).json({ message: "Failed to remove item", error: err.message });
      }
    },

    // 🧠 Merge guest cart into user cart
mergeGuestCart: async (req, res) => {
  const userId = req.user?.userId;
  const items = req.body?.items || [];

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid items payload" });

  try {
    for (const { productId, quantity } of items) {
      if (!productId || typeof productId !== "string") continue;
      const qty = Math.max(Number(quantity) || 1, 1);

      const existing = await cart.findOne({ userId, productId });

      if (existing) {
        await cart.updateOne({ userId, productId }, { $inc: { quantity: qty } });
      } else {
        await cart.insertOne({
          userId,
          productId,
          quantity: qty,
          createdAt: new Date(),
        });
      }
    }

    const updatedCart = await cart.find({ userId }).toArray();
    res.status(200).json({ success: true, items: updatedCart });
  } catch (err) {
    console.error("❌ Merge cart failed:", err.message);
    res.status(500).json({ message: "Failed to merge guest cart", error: err.message });
  }
},
  };
}
