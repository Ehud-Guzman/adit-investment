import { ObjectId } from "mongodb";
import {
  normalizeCartItems,
  sanitizeGhostCartItems,
  isValidObjectId,
} from "../utils/cartHelpers.js";

export default function CartController(cart, products) {
  const MAX_QTY = 10;

  const safeObjectId = (id) => {
    try {
      return ObjectId.isValid(id) ? new ObjectId(id) : null;
    } catch {
      return null;
    }
  };

  return {
    // 📦 GET /cart
    getUserCart: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      try {
        await sanitizeGhostCartItems(userId, cart, products);
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
      const safeId = safeObjectId(productId);

      if (!userId || !safeId) {
        return res.status(400).json({ message: `Invalid product ID: ${productId}` });
      }

      const qty = Math.min(Math.max(Number(quantity) || 1, 1), MAX_QTY);

      try {
        const product = await products.findOne({ _id: safeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const existing = await cart.findOne({ userId, productId });

        if (existing) {
          await cart.updateOne(
            { userId, productId },
            { $inc: { quantity: qty }, $set: { updatedAt: new Date() } }
          );
        } else {
          await cart.insertOne({
            userId,
            productId,
            quantity: qty,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        await sanitizeGhostCartItems(userId, cart, products);
        const updatedCart = await cart.find({ userId }).toArray();
        res.status(200).json(normalizeCartItems(updatedCart));
      } catch (err) {
        res.status(500).json({ message: "Add to cart failed", error: err.message });
      }
    },

    // ✏️ PATCH /cart/:id
    updateItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { quantity } = req.body;
      const safeCartItemId = safeObjectId(id);

      if (!safeCartItemId) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const qty = Math.min(Math.max(Number(quantity) || 1, 1), MAX_QTY);

      try {
        const result = await cart.updateOne(
          { _id: safeCartItemId, userId },
          { $set: { quantity: qty, updatedAt: new Date() } }
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

    // ❌ DELETE /cart/:id
    removeItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;
      const safeCartItemId = safeObjectId(id);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!safeCartItemId) {
        const fallbackCart = await cart.find({ userId }).toArray();
        return res.status(200).json(normalizeCartItems(fallbackCart));
      }

      try {
        const result = await cart.deleteOne({ _id: safeCartItemId, userId });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        const updatedCart = await cart.find({ userId }).toArray();
        return res.status(200).json(normalizeCartItems(updatedCart));
      } catch (err) {
        return res.status(500).json({ message: "Failed to remove item", error: err.message });
      }
    },

    // 🛉 DELETE /cart/clear
    clearCart: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      try {
        await cart.deleteMany({ userId });
        res.status(200).json({ success: true, message: "Cart cleared" });
      } catch (err) {
        res.status(500).json({ message: "Failed to clear cart", error: err.message });
      }
    },

    // 🔁 POST /cart/merge
    mergeGuestCart: async (req, res) => {
      const userId = req.user?.userId;
      const items = req.body?.items || [];

      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid items payload" });

      try {
        const bulkOps = [];

        for (const { productId, quantity } of items) {
          const safeId = safeObjectId(productId);
          if (!safeId) continue;

          const qty = Math.min(Math.max(Number(quantity) || 1, 1), MAX_QTY);

          const existing = await cart.findOne({ userId, productId });

          if (existing) {
            bulkOps.push({
              updateOne: {
                filter: { userId, productId },
                update: { $inc: { quantity: qty }, $set: { updatedAt: new Date() } },
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
                  updatedAt: new Date(),
                },
              },
            });
          }
        }

        if (bulkOps.length) await cart.bulkWrite(bulkOps);

        await sanitizeGhostCartItems(userId, cart, products);
        const updatedCart = await cart.find({ userId }).toArray();
        res.status(200).json({ success: true, items: normalizeCartItems(updatedCart) });
      } catch (err) {
        console.error("❌ Merge cart failed:", err.message);
        res.status(500).json({ message: "Failed to merge cart", error: err.message });
      }
    },

    // 💰 GET /cart/total
    getCartTotal: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      try {
        const cartItems = await cart.find({ userId }).toArray();
        const normalized = normalizeCartItems(cartItems);

        const productIds = normalized
          .map((item) => safeObjectId(item.productId))
          .filter(Boolean);

        const productsList = await products.find({ _id: { $in: productIds } }).toArray();

        const productMap = productsList.reduce((acc, p) => {
          acc[p._id.toString()] = p;
          return acc;
        }, {});

        const total = normalized.reduce((sum, item) => {
          const product = productMap[item.productId];
          const price = product?.price || 0;
          return sum + price * item.quantity;
        }, 0);

        res.status(200).json({ total, items: normalized });
      } catch (err) {
        res.status(500).json({ message: "Failed to calculate total", error: err.message });
      }
    },
  };
}
