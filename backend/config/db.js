// config/db.js
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("❌ MONGO_URI is not defined in .env");

const client = new MongoClient(uri);

let _db;
let collections = {};

/**
 * 🚀 Connect to MongoDB and initialize collections/indexes
 */
export async function connectDB() {
  try {
    await client.connect();
    console.log("🧠 MongoDB connected successfully");

    _db = client.db("ADIT-website");

    // 🧱 Collections (Define ALL before using them)
    collections.products = _db.collection("products");
    collections.users = _db.collection("users");
    collections.cart = _db.collection("cart");
    collections.wishlist = _db.collection("wishlist");
    collections.reviews = _db.collection("reviews");
    collections.sessions = _db.collection("sessions");
    collections.adminSettings = _db.collection("adminSettings");
    collections.email_tokens = _db.collection("email_tokens"); // ✅ added

    // 🧾 Indexes (optimize queries, enforce constraints)
    await Promise.all([
      collections.products.createIndex({ category: 1, rating: -1 }),
      collections.users.createIndex({ email: 1 }, { unique: true }),
      collections.users.createIndex({ role: 1 }),
      collections.users.createIndex({ status: 1 }),
      collections.cart.createIndex({ userId: 1, productId: 1 }),
      collections.wishlist.createIndex({ userId: 1, productId: 1 }),
      collections.reviews.createIndex({ productId: 1, createdAt: -1 }),
      collections.sessions.createIndex({ refreshToken: 1 }, { unique: true }),
      collections.sessions.createIndex({ userId: 1 }),
      collections.adminSettings.createIndex({ key: 1 }, { unique: true }),
      collections.email_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }), // ✅ token TTL
    ]);

    console.log("✅ All indexes created successfully");

    return { ...collections, db: _db };
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// 📦 Named collection exports (optional - use if needed elsewhere)
export const {
  products,
  users,
  cart,
  wishlist,
  reviews,
  sessions,
  adminSettings,
  email_tokens,
} = collections;

export { _db as db, client as mongoClient };

// 🔎 ID Validators & Helpers
const isValidObjectId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

export const getQueryId = (id) =>
  isValidObjectId(id) ? { _id: new ObjectId(id) } : null;

export const getQueryUserId = (userId) =>
  isValidObjectId(userId) ? { userId: new ObjectId(userId) } : null;

export const getQueryProductId = (productId) =>
  isValidObjectId(productId) ? { productId: new ObjectId(productId) } : null;

export const getQueryCartItemId = (cartItemId) =>
  isValidObjectId(cartItemId) ? { _id: new ObjectId(cartItemId) } : null;

// ✂️ Soft delete filter utility
export const excludeDeleted = (query = {}) => ({
  ...query,
  status: { $ne: "deleted" },
});
