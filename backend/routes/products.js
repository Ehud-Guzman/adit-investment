// routes/products.js
import express from 'express';
import ProductController from '../controllers/productController.js';

/**
 * Creates and configures the product routes.
 * @param {MongoCollection} productsCollection - The MongoDB collection instance.
 * @returns {express.Router} Configured router for product endpoints.
 */
export default function createProductRouter(productsCollection) {
  const router = express.Router();
  const controller = ProductController(productsCollection); // ✅ Instantiate controller with the collection

  // ✅ Special routes (must come first before dynamic routes)
  router.get('/random', controller.getRandom); // /api/products/random

  // ✅ Standard CRUD routes
  router.get('/', controller.getAll);               // /api/products
  router.get('/:id', controller.getById);           // /api/products/:id
  router.post('/', controller.create);              // POST new product
  router.put('/:id', controller.update);            // Full update
  router.patch('/:id', controller.patch);           // Partial update
  router.delete('/:id', controller.remove);         // Delete product

  return router;
}
