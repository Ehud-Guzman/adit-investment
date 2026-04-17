import express from "express";
import multer from "multer";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  exportProducts,
} from "../controllers/admin/productController.js";
import { protect, isAdmin } from "../middleware/auth/index.js";

const upload = multer({ storage: multer.memoryStorage() });

export default function createAdminProductRouter(productsCollection) {
  const router = express.Router();

  router.use(protect, isAdmin);

  router.get("/", (req, res) => getAdminProducts(req, res, productsCollection));
  router.get("/export", (req, res) => exportProducts(req, res, productsCollection));
  router.post("/", (req, res) => createProduct(req, res, productsCollection));
  router.post("/import", upload.single("file"), (req, res) => importProducts(req, res, productsCollection));
  router.put("/:id", (req, res) => updateProduct(req, res, productsCollection));
  router.delete("/:id", (req, res) => deleteProduct(req, res, productsCollection));

  return router;
}
