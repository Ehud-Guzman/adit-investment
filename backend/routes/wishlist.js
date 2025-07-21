// routes/wishlist.js
import express from "express";
import WishlistController from "../controllers/wishlistController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export default function createWishlistRouter(wishlist) {
  const router = express.Router();
  const controller = WishlistController(wishlist);

  // 🛡 All wishlist routes require auth
  router.use(verifyToken);

  router.get("/", controller.getUserWishlist);            // ✅ Get all wishlist items
  router.post("/", controller.toggleWishlistItem);        // ✅ Toggle wishlist item
  router.delete("/clear", controller.clearWishlist);      // ✅ Clear wishlist
  router.delete("/:id", controller.removeWishlistItem);   // ✅ Delete specific wishlist item

  return router;
}
