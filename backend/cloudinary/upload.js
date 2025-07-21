// routes/upload.js
import express from "express";
import { upload } from "../config/cloudinary.js";
import multer from "multer";

const router = express.Router();

// 🔐 Optional Middleware to Protect Uploads (admin-only?)


// @route   POST /api/upload
// @desc    Upload single image to Cloudinary
// @access  Public (add protect + isAdmin for restriction)
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("[Upload] ❌ Multer error:", err.message);
      return res.status(400).json({ message: "Upload error", error: err.message });
    } else if (err) {
      console.error("[Upload] ❌ Server error:", err.message);
      return res.status(500).json({ message: "Upload failed", error: err.message });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image was uploaded" });
    }

    res.status(201).json({ url: req.file.path });
  });
});

export default router;
