import express from "express";
import { createAdminUserController } from "../../routes/admin/userAdminController.js";
import { verifyAdmin, verifySuperAdmin } from "../../middleware/auth/index.js";

const createAdminUserRouter = (users, db) => {
  const {
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    softDeleteUser,
    updateUserDetails,
    restoreUser,
  } = createAdminUserController(users, db);

  const router = express.Router();

  // 🧠 Admin User Management Routes
  router.get("/", verifyAdmin, getAllUsers);
  router.get("/:id", verifyAdmin, getUserById);
  router.patch("/:id/status", verifySuperAdmin, updateUserStatus);
  router.patch("/:id/role", verifySuperAdmin, updateUserRole);
  router.patch("/:id/edit", verifyAdmin, updateUserDetails);
  router.patch("/:id/restore", verifyAdmin, restoreUser);
  router.delete("/:id", verifyAdmin, softDeleteUser);

  return router;
};

export default createAdminUserRouter;
