// routes/products.js
import express from 'express';
import ProductController from '../controllers/productController.js';

export default function createProductRouter(productsCollection) {
  const router = express.Router();
  const controller = ProductController(productsCollection); // ← this must be called

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
