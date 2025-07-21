// controllers/wishlistController.js
import { ObjectId } from "mongodb";

export default function WishlistController(wishlist) {
  return {
    getUserWishlist: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      try {
        const items = await wishlist.find({ userId }).toArray();
        res.status(200).json(items);
      } catch (err) {
        res.status(500).json({ message: "Error fetching wishlist", error: err.message });
      }
    },

    toggleWishlistItem: async (req, res) => {
      const userId = req.user?.userId;
      const { productId } = req.body;

      if (!userId || !ObjectId.isValid(productId)) {
        return res.status(400).json({ message: `Invalid productId: ${productId}` });
      }

      try {
        const query = { userId, productId };
        const exists = await wishlist.findOne(query);

        if (exists) {
          await wishlist.deleteOne(query);
          return res.status(200).json({ message: "Removed from wishlist" });
        }

        const item = { userId, productId, createdAt: new Date() };
        await wishlist.insertOne(item);
        return res.status(201).json({ message: "Added to wishlist" }); // ✅ Response now sent!
      } catch (err) {
        res.status(500).json({ message: "Toggle failed", error: err.message });
      }
    },

    removeWishlistItem: async (req, res) => {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid or missing wishlist item ID" });
      }

      try {
        const result = await wishlist.deleteOne({
          _id: new ObjectId(id),
          userId,
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Wishlist item not found" });
        }

        res.status(200).json({ message: "Removed from wishlist" });
      } catch (err) {
        res.status(500).json({ message: "Remove failed", error: err.message });
      }
    },

    clearWishlist: async (req, res) => {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      try {
        await wishlist.deleteMany({ userId });
        res.status(200).json({ message: "Wishlist cleared" });
      } catch (err) {
        res.status(500).json({ message: "Clear failed", error: err.message });
      }
    },
  };
}
