import express from "express";
import { createAuthController } from "../controllers/auth/createAuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createEmailController } from "../controllers/emailController.js";

const createAuthRouter = (usersCollection, sessionsCollection, db) => {
  const router = express.Router();

  const authController = createAuthController(usersCollection, sessionsCollection, db);
  const emailController = createEmailController(db);

  // 🧑‍💻 Auth Routes
  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/refresh", authController.refreshToken);
  router.post("/logout", authController.logout);
  router.get("/me", verifyToken, authController.getCurrentUser); // 🔐 Protected

  // 📩 Email Routes
  router.get("/verify-email/:token", emailController.verifyEmail);
  router.post("/resend-verification", emailController.resendVerificationEmail);

  return router;
};

export default createAuthRouter;
