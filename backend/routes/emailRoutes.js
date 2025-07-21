import express from "express";
import { createEmailController } from "../controllers/emailController.js";

const createEmailRouter = (db) => {
  const router = express.Router();
  const { verifyEmail, resendVerificationEmail } = createEmailController(db);

  router.get("/verify-email/:token", verifyEmail);
  router.post("/resend-verification", resendVerificationEmail);

  // Catch all
  router.use((req, res) =>
    res.status(404).json({ message: `❌ Email route not found: ${req.originalUrl}` })
  );

  return router;
};

export default createEmailRouter;
