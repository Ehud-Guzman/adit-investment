// backend/controllers/cleanupController.js
export const cleanupOrphanedData = async (req, res) => {
  try {
    const productDocs = await req.db.products.find({}, { projection: { _id: 1 } }).toArray();
    const validProductIds = productDocs.map(p => p._id.toString());

    const removedCart = await req.db.cart.deleteMany({
      productId: { $nin: validProductIds },
    });

    const removedWishlist = await req.db.wishlist.deleteMany({
      productId: { $nin: validProductIds },
    });

    const removedReviews = await req.db.reviews.deleteMany({
      productId: { $nin: validProductIds },
    });

    res.json({
      message: '✅ Cleanup complete',
      removedFromCart: removedCart.deletedCount,
      removedFromWishlist: removedWishlist.deletedCount,
      removedReviews: removedReviews.deletedCount,
    });
  } catch (err) {
    console.error(`[${req.requestId}] ❌ Cleanup failed:`, err.message);
    res.status(500).json({ message: 'Cleanup failed', error: err.message });
  }
};
export const cleanupExpiredSessions = async (req, res) => {
  try {
    const result = await req.db.sessions.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    res.json({
      message: '✅ Expired sessions cleaned up',
      removedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(`[${req.requestId}] ❌ Cleanup failed:`, err.message);
    res.status(500).json({ message: 'Cleanup failed', error: err.message });
  }
};
