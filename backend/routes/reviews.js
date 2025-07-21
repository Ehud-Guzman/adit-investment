// routes/reviews.js

import express from "express";
import { ObjectId } from "mongodb";
import { verifyAuth } from "../middleware/auth.js";

export default function createReviewRouter(reviewsCollection, usersCollection, productsCollection) {
  const router = express.Router();

  // ✅ GET all reviews for a product
  router.get("/:productId", async (req, res) => {
    try {
      const { productId } = req.params;

      if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const reviews = await reviewsCollection
        .find({ productId: new ObjectId(productId) })
        .sort({ createdAt: -1 })
        .project({
          _id: 1,
          userId: 1,
          userName: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
        })
        .toArray();

      res.status(200).json(reviews);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error.message);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // ✅ POST a new review
  router.post('/:productId', verifyAuth, async (req, res) => {
    try {
      const { productId } = req.params;
      const { rating, text } = req.body;
      const userId = req.userId;

      if (!userId || !rating || !text || !ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newReview = {
        productId: new ObjectId(productId),
        userId: new ObjectId(userId),
        userName: user.name || user.email || "Anonymous",
        rating: parseInt(rating),
        comment: text,
        createdAt: new Date(),
      };

      const result = await reviewsCollection.insertOne(newReview);
      const created = await reviewsCollection.findOne({ _id: result.insertedId });

      // Recalculate average rating
      const productReviews = await reviewsCollection.find({ productId: new ObjectId(productId) }).toArray();
      const avgRating = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;

      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: { rating: avgRating } }
      );

      res.status(201).json(created);
    } catch (error) {
      console.error('❌ Error posting review:', error.message);
      res.status(500).json({ message: 'Failed to post review' });
    }
  });

  // 🛠 PUT: Update a review
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const update = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const result = await reviewsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" }
      );

      if (!result.value) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json(result.value);
    } catch (error) {
      console.error("❌ Error updating review:", error.message);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  // ❌ DELETE a review
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting review:", error.message);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  return router;
}