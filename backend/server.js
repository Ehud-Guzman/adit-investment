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

// 🧩 Route Factories (Dependency Injected)
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


// 📦 Non-DI Routes
import uploadRoutes from "./routes/upload.js";
import cleanupRoutes from "./routes/cleanup.js";

// 🌍 Load environment variables
dotenv.config();
validateEnv();

// 🚀 App Init
const app = express();

// 🔒 Secure HTTP Headers
app.use(helmet());

// 💨 Prevent HTTP Parameter Pollution
app.use(hpp());

// 🍪 Parse Cookies
app.use(cookieParser());

// 🔄 Parse JSON & URL-encoded Bodies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 🔧 GZIP Compression
app.use(compression());

// 🧼 Sanitize Inputs (basic)
app.use((req, _res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (/^\$/.test(key) || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/[<>]/g, "");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
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

// CORS setup with clear logging
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        // 🧪 Allow tools like Postman or curl (no origin)
        return cb(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      console.warn("⛔️ Blocked CORS origin:", origin);
      return cb(new Error("CORS not allowed from " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// 🛡️ Rate Limiting & Throttling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⏱ Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => Math.min((hits - 50) * 300, 2000),
});

app.use("/api", limiter, speedLimiter);

// 🎯 Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "✅ API is healthy" });
});

// 🧠 Boot Server Function
async function startServer() {
  try {
    console.log("🧠 Connecting to MongoDB...");
    const collections = await connectDB();

    app.locals.db = collections._db || collections.db;
    console.log("✅ MongoDB connected");

    // Injected Routes (dependency-based)
    app.use("/api/auth", createAuthRouter(collections.users, collections.sessions, collections.db));
    app.use("/api/users", createUserRouter(collections.users));
    app.use("/api/products", createProductRouter(collections.products));
    app.use("/api/cart", createCartRouter(collections.cart));
    app.use("/api/wishlist", createWishlistRouter(collections.wishlist));
    app.use("/api/reviews", createReviewRouter(collections.reviews, collections.users));
    app.use("/api/admin/products", createAdminProductRouter(collections.products));
    app.use("/api/admin/users", createAdminUserRouter(collections.users));
    app.use("/api/admin/dashboard", createAdminDashboardRouter());
    app.use("/api/email", createEmailRouter(app.locals.db));


    // 🔐 Super Admin - Settings Routes (after DB connection)
    const settingsRouter = createSettingsRouter(collections.adminSettings);
    app.use("/api/settings", settingsRouter);

    // Static routes (no DB)
    app.use("/api/upload", uploadRoutes);
    app.use("/api/cleanup", cleanupRoutes);

    // ❌ Catch-all for unknown routes
    app.use((req, res) => {
      res.status(404).json({
        message: `❌ Route not found: ${req.originalUrl}`,
      });
    });

    // 🔥 Fire it up
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server live at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("💥 Server startup failed:", err.message);
    process.exit(1);
  }
}

// 🚨 Fatal Crash Catchers
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err.message);
  process.exit(1);
});

// 🧠 Start it
startServer();
