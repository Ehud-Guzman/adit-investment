import express from "express";
import { createAuthController } from "../controllers/auth/createAuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const createAuthRouter = (usersCollection, sessionsCollection, db) => {
  const authController = createAuthController(usersCollection, sessionsCollection, db);
  const router = express.Router();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/refresh", authController.refreshToken);
  router.post("/logout", authController.logout);
  router.get("/me", verifyToken, authController.getCurrentUser); // 🔐 Protected

  return router;
};

export default createAuthRouter;
