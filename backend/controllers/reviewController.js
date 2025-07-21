// controllers/reviewController.js

import { ObjectId } from "mongodb";
import { reviews, users, products } from "../config/db.js";

// GET /reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const data = await reviews
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .project({ userId: 1, userName: 1, rating: 1, comment: 1, createdAt: 1 })
      .toArray();

    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch reviews:", err.message);
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

// POST /reviews/:productId
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, text } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await products.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await users.findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const review = {
      productId: new ObjectId(productId),
      userId: new ObjectId(req.userId),
      userName: user.name || user.email,
      rating: Number(rating),
      comment: text || "",
      createdAt: new Date(),
    };

    const result = await reviews.insertOne(review);
    const insertedReview = await reviews.findOne({ _id: result.insertedId });

    // Update average rating
    const productReviews = await reviews.find({ productId: new ObjectId(productId) }).toArray();
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    await products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { rating: avgRating } }
    );

    res.status(201).json(insertedReview);
  } catch (err) {
    console.error("❌ Failed to submit review:", err.message);
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};
