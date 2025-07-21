import express from "express";
import CartController from "../controllers/cartController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export default function createCartRouter(cart) {
  const router = express.Router();
  const controller = CartController(cart);

  router.use(verifyToken);

  router.get("/", controller.getUserCart);
  router.post("/", controller.addToCart);
 router.post('/merge', verifyToken, controller.mergeGuestCart);

  router.put("/:id", controller.updateItem);
  router.delete("/:id", controller.removeItem);

  return router;
}
