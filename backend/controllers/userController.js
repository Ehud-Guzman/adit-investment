import { logAdminAction } from "../utils/logger/adminLogger.js";
import {
  isValidEmail,
  isValidId,
  checkUserExists,
  createUser,
  getUsersPaginated,
  findUserById,
  updateUser,
  deleteUser,
  toggleAdminStatus,
  changeUserStatus
} from "../services/userService.js";

export const createUserController = (users, db) => ({

  createUser: async (req, res) => {
    try {
      const { name, email, password, isAdmin = false } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
      if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });

      const exists = await checkUserExists(users, email);
      if (exists) return res.status(409).json({ message: "Email already exists" });

      const newUser = await createUser(users, { name, email, password, isAdmin });

      await logAdminAction(db, {
        action: "create_user",
        performedBy: req.user?._id,
        targetUserId: newUser._id,
        metadata: { name, email, isAdmin },
      });

      res.status(201).json(newUser);
    } catch (err) {
      console.error("❌ Create user error:", err);
      res.status(500).json({ message: "Failed to create user" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const data = await getUsersPaginated(users, req.query);
      res.json(data);
    } catch (err) {
      console.error("❌ Get all users error:", err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) return res.status(400).json({ message: "Invalid user ID" });

      const user = await findUserById(users, id);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      console.error("❌ Get user error:", err);
      res.status(500).json({ message: "Failed to get user" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      if (!isValidId(id)) return res.status(400).json({ message: "Invalid user ID" });

      const updateData = {};
      if (name) updateData.name = name;
      if (email) {
        if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
        const exists = await checkUserExists(users, email, id);
        if (exists) return res.status(409).json({ message: "Email already in use" });
        updateData.email = email;
      }
      if (password) updateData.password = password;
      if (!Object.keys(updateData).length) return res.status(400).json({ message: "No update fields provided" });

      const updatedUser = await updateUser(users, id, updateData);

      await logAdminAction(db, {
        action: "update_user",
        performedBy: req.user?._id,
        targetUserId: updatedUser._id,
        metadata: { update: updateData },
      });

      res.json(updatedUser);
    } catch (err) {
      console.error("❌ Update user error:", err);
      res.status(500).json({ message: "Failed to update user" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) return res.status(400).json({ message: "Invalid user ID" });

      const result = await deleteUser(users, id);
      if (!result.deletedCount) return res.status(404).json({ message: "User not found or already deleted" });

      await logAdminAction(db, {
        action: "delete_user",
        performedBy: req.user?._id,
        targetUserId: id,
        metadata: {},
      });

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("❌ Delete user error:", err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  },

  toggleAdminStatus: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) return res.status(400).json({ message: "Invalid user ID" });

      const user = await findUserById(users, id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const updatedUser = await toggleAdminStatus(users, id, user.isAdmin);

      await logAdminAction(db, {
        action: updatedUser.isAdmin ? "promote_to_admin" : "demote_to_user",
        performedBy: req.user?._id,
        targetUserId: updatedUser._id,
        metadata: {},
      });

      res.json({
        message: `User is now ${updatedUser.isAdmin ? "an admin" : "a regular user"}`,
        user: updatedUser,
      });
    } catch (err) {
      console.error("❌ Toggle admin error:", err);
      res.status(500).json({ message: "Failed to toggle admin status" });
    }
  },

  updateUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowed = ["active", "suspended", "deleted", "locked"];
      if (!isValidId(id)) return res.status(400).json({ message: "Invalid user ID" });
      if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status value" });

      const updatedUser = await changeUserStatus(users, id, status);

      await logAdminAction(db, {
        action: "update_status",
        performedBy: req.user?._id,
        targetUserId: updatedUser._id,
        metadata: { newStatus: status },
      });

      res.json({ message: `User status updated to "${status}"`, user: updatedUser });
    } catch (err) {
      console.error("❌ Status update error:", err);
      res.status(500).json({ message: "Failed to update user status" });
    }
  },
});
