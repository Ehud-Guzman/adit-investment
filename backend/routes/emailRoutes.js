// routes/emailRoutes.js
import express from "express";
import { createEmailController } from "../controllers/emailController.js";

const createEmailRouter = (db) => {
  const router = express.Router();

  const {
    verifyEmail,
    resendVerificationEmail,
  } = createEmailController(db);

  // ✅ Email Verification Link
  router.get("/verify/:token", verifyEmail);

  // 🔁 Resend Verification Email
  router.post("/resend", resendVerificationEmail);

  // ❌ Catch-All for invalid email routes
  router.use("*", (req, res) =>
    res.status(404).json({ message: `❌ Invalid email route: ${req.originalUrl}` })
  );

  return router;
};

export default createEmailRouter;
