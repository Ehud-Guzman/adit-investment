// backend/config/envCheck.js
export const validateEnv = () => {
  const requiredVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "ADMIN_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "ALLOWED_ORIGINS",
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required ENV variables:", missing.join(", "));
    process.exit(1);
  } else {
    console.log("✅ All required environment variables are present.");
  }
};
