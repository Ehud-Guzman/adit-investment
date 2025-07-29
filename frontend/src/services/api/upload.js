import { api } from "./index";

// Helper to cleanly unwrap responses and handle errors
const unwrap = (promise) =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      console.error("❌ API error:", err);
      throw err.response?.data || new Error("Unexpected error");
    });

// Image Uploads
export const uploadImage = (formData) =>
  unwrap(api.post("/upload", formData)); // Let Axios set headers

export const deleteImage = (imageUrl) =>
  unwrap(api.delete("/upload", { data: { imageUrl } }));

// File Uploads
export const uploadFile = (formData) =>
  unwrap(api.post("/upload/file", formData));

export const deleteFile = (fileUrl) =>
  unwrap(api.delete("/upload/file", { data: { fileUrl } }));
