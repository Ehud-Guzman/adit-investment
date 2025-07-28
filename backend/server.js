// server.js

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/envCheck.js";

// 🧩 Route Factories
import createAuthRouter from "./routes/auth.js";
import createUserRouter from "./routes/users.js";
import createProductRouter from "./routes/products.js";
import createCartRouter from "./routes/cart.js";
import createWishlistRouter from "./routes/wishlist.js";
import createReviewRouter from "./routes/reviews.js";
import createAdminProductRouter from "./routes/adminProducts.js";
import createAdminUserRouter from "./routes/admin/users.js";
import createAdminDashboardRouter from "./routes/admin/dashboardRoutes.js";
import createSettingsRouter from "./routes/settings.js";
import createEmailRouter from "./routes/emailRoutes.js";
import createAdminOrderRoutes from "./routes/admin/orders.js";
import { injectCollections } from "./controllers/orderController.js";



import createOrderRoutes from "./routes/orderRoutes.js";



// 📦 Non-DI Routes
import uploadRoutes from "./routes/upload.js";
import cleanupRoutes from "./routes/cleanup.js";

// 🌍 Environment Setup
dotenv.config();
validateEnv();

const app = express();

// 🔒 Security & Hardening
app.use(helmet());
app.use(hpp());
app.use(cookieParser());

// 🔄 Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ⚡ Performance
app.use(compression());

// 🧼 Input Sanitization Middleware
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (/^\$/.test(key) || key.includes(".")) delete obj[key];
      else if (typeof obj[key] === "string") obj[key] = obj[key].replace(/[<>]/g, "");
      else if (typeof obj[key] === "object" && obj[key] !== null) sanitize(obj[key]);
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// 🌐 CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://adit-investment.netlify.app",
  "https://adit-investment-1.onrender.com",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      console.warn("⛔️ Blocked CORS origin:", origin);
      cb(new Error("CORS not allowed from " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🛡️ Rate Limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "⏱ Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  }),
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: (hits) => Math.min((hits - 50) * 300, 2000),
  })
);

// 🎯 Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "✅ API is healthy" });
});

// 🧠 Server Boot Function
async function startServer() {
  try {
    console.log("🧠 Connecting to MongoDB...");
    const collections = await connectDB();
    

    app.locals.db = collections._db || collections.db;
    console.log("✅ MongoDB connected successfully");
    injectCollections({ orders: collections.orders, products: collections.products });
console.log("🧩 Order controller collections injected");


    // 🔌 DI Routes
    app.use("/api/auth", createAuthRouter(collections.users, collections.sessions, collections.db));
    app.use("/api/users", createUserRouter(collections.users));
    app.use("/api/products", createProductRouter(collections.products));
    app.use("/api/cart", createCartRouter(collections.cart));
    app.use("/api/wishlist", createWishlistRouter(collections.wishlist));
    app.use("/api/reviews", createReviewRouter(collections.reviews, collections.users));
    app.use("/api/admin/products", createAdminProductRouter(collections.products));
    app.use("/api/admin/users", createAdminUserRouter(collections.users));
    app.use("/api/admin/dashboard", createAdminDashboardRouter());
    app.use("/api/settings", createSettingsRouter(collections.adminSettings));
    app.use("/api/admin/orders", createAdminOrderRoutes(collections));

    
    
  

    app.use("/api/orders", createOrderRoutes(collections));



    // 🧱 Static/Utility Routes
    app.use("/api/upload", uploadRoutes);
    app.use("/api/cleanup", cleanupRoutes);

    // ❌ 404 Catch-All
    app.use((req, res) => {
      res.status(404).json({ message: `❌ Route not found: ${req.originalUrl}` });
    });

    // 🚀 Start Server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server live at http://localhost:${PORT}`));
  } catch (err) {
    console.error("💥 Server startup failed:", err.message);
    process.exit(1);
  }
}

// 🚨 Crash Handlers
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});

// 🧠 Start
startServer();
