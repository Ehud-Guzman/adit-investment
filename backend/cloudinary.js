// backend/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // "dcywqtljq"
  api_key: process.env.CLOUDINARY_API_KEY,         // "655339527751366"
  api_secret: process.env.CLOUDINARY_API_SECRET,   // "KxxB1oIbs9ZWKof6fn_Gcizr8M0"
});

// ✅ Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Adit-products', // 👈 optional custom folder on Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // optional resize
  },
});

// ✅ Set up multer upload middleware
const upload = multer({ storage });

export { cloudinary, upload };
