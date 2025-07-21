import { api } from "./index";

export const uploadImage = (formData) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
export const deleteImage = (imageUrl) =>
  api.delete("/upload", { data: { imageUrl } })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to delete image:", err);
      throw err.response?.data || new Error("Image deletion failed");
    });
export const uploadFile = (formData) =>
  api.post("/upload/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data)
    .catch((err) => {
      console.error("Failed to upload file:", err);
      throw err.response?.data || new Error("File upload failed");
    });
export const deleteFile = (fileUrl) =>
  api.delete("/upload/file", { data: { fileUrl } })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to delete file:", err);
      throw err.response?.data || new Error("File deletion failed");
    }); 