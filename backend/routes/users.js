import express from "express";
import { createUserController } from "../controllers/userController.js";
import {
  verifyToken,
  verifyAdmin,
  verifyUserOrAdmin,
} from "../middleware/auth/index.js";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin.js";

const createUserRouter = (users) => {
  const router = express.Router();
  const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleAdminStatus,
    updateUserStatus, // ✅ Included
  } = createUserController(users);

  router.post("/", verifyAdmin, createUser);
  router.get("/", verifyAdmin, getAllUsers);
  router.get("/:id", verifyToken, verifyUserOrAdmin, getUserById);
  router.put("/:id", verifyToken, verifyUserOrAdmin, updateUser);
  router.delete("/:id", verifyAdmin, deleteUser);

  router.patch(
    "/:id/toggle-admin",
    verifyToken,
    verifySuperAdmin,
    toggleAdminStatus
  );

  router.patch(
    "/:id/status", // ✅ THIS FIXES YOUR FRONTEND 404
    verifyToken,
    verifyAdmin,
    updateUserStatus
  );

  // Catch-all
  router.use((req, res) =>
    res
      .status(404)
      .json({ message: `❌ User route not found: ${req.originalUrl}` })
  );

  return router;
};

export default createUserRouter;
