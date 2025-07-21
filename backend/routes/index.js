import express from 'express';
import auth from './auth.js';
import product from './products.js';
import cart from './cart.js';
import wishlist from './wishlist.js';
import review from './reviews.js';
import upload from './upload.js';
import createUserRouter from './users.js';

const createRoutes = (users) => {
  const router = express.Router();

  router.use('/auth', auth);
  router.use('/products', product); // or product(db) if it’s a factory
  router.use('/cart', cart);
  router.use('/wishlist', wishlist);
  router.use('/reviews', review);
  router.use('/upload', upload);

  // ✅ finally fixed
  router.use("/admin/users", createUserRouter(users));

  return router;
};

export default createRoutes;
