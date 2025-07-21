// backend/config/index.js
import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./envCheck.js";
validateEnv();

export const config = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  adminSecret: process.env.ADMIN_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(","),
  port: process.env.PORT || 8080,
};
