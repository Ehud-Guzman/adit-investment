// routes/upload.js
import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

import streamifier from "streamifier";

const router = express.Router();
const upload = multer(); // Using in-memory buffer

/**
 * @route   POST /api/upload
 * @desc    Upload a single image to Cloudinary
 * @access  Public (🛡️ Add protect + isAdmin middleware if needed)
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // 🚀 Upload stream to Cloudinary
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Adit-products", // Optional: custom folder
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 800, height: 800, crop: "limit" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer();

    return res.status(201).json({
      url: result.secure_url,      // ✅ This is what you use on frontend
      public_id: result.public_id, // 🧹 Useful for future deletions
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    return res.status(500).json({
      message: "Image upload failed.",
      error: err.message,
    });
  }
});

export default router;
