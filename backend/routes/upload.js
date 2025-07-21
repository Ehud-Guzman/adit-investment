import express from "express";
import { upload } from "../cloudinary.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file?.path) throw new Error("No image returned from Cloudinary");
    res.status(201).json({ url: req.file.path });
  } catch (err) {
    console.error(`[UPLOAD ERROR]`, err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

export default router;
