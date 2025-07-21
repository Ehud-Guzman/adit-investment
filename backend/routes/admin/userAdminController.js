import { ObjectId } from "mongodb";

export const createAdminUserController = (users) => {
  return {
    // ✅ GET ALL USERS with filters, pagination, projection
    getAllUsers: async (req, res) => {
      try {
        const {
          search = "",
          role = "all",
          status = "all",
          page = 1,
          limit = 10,
        } = req.query;

        const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
        const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (parsedPage - 1) * parsedLimit;

        const query = {};

        if (search.trim()) {
          const regex = new RegExp(search.trim(), "i");
          query.$or = [{ name: regex }, { email: regex }];
        }

        if (role !== "all") query.role = role;
        if (status !== "all") query.status = status;

        const projection = { password: 0 };

        const [usersList, total] = await Promise.all([
          users.find(query)
            .project(projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .toArray(),
          users.countDocuments(query),
        ]);

        return res.status(200).json({
          users: usersList,
          total,
          page: parsedPage,
          pages: Math.ceil(total / parsedLimit),
        });
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        return res.status(500).json({ message: "Failed to fetch users", error: err.message });
      }
    },

    // ✅ GET USER BY ID
    getUserById: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        const user = await users.findOne(
          { _id: new ObjectId(id) },
          { projection: { password: 0 } }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
      } catch (err) {
        console.error("❌ Failed to get user:", err);
        return res.status(500).json({ message: "Failed to fetch user", error: err.message });
      }
    },

    // ✅ UPDATE USER STATUS
    updateUserStatus: async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        const validStatuses = ["active", "locked", "deleted"];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status value" });

        const user = await users.findOne({ _id: new ObjectId(id) });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.status === status) return res.status(200).json({ message: `User is already '${status}'` });

        await users.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

        return res.status(200).json({ message: `User status updated to '${status}'` });
      } catch (err) {
        console.error("❌ Failed to update user status:", err);
        return res.status(500).json({ message: "Failed to update user status", error: err.message });
      }
    },

    // ✅ UPDATE USER ROLE
    updateUserRole: async (req, res) => {
      try {
        const id = req.params.id;
        const { role } = req.body;

        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        const validRoles = ["user", "admin", "vendor", "superadmin"];
        if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role value" });

        const user = await users.findOne({ _id: new ObjectId(id) });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === role) return res.status(200).json({ message: `User is already '${role}'` });

        await users.updateOne({ _id: new ObjectId(id) }, { $set: { role } });

        return res.status(200).json({ message: `User role updated to '${role}'` });
      } catch (err) {
        console.error("❌ Failed to update user role:", err);
        return res.status(500).json({ message: "Failed to update user role", error: err.message });
      }
    },

    // ✅ SOFT DELETE USER
    softDeleteUser: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        const result = await users.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "deleted" } }
        );

        return res.status(200).json({ message: "User soft-deleted", modified: result.modifiedCount });
      } catch (err) {
        console.error("❌ Failed to delete user:", err);
        return res.status(500).json({ message: "Failed to delete user", error: err.message });
      }
    },

    // ✅ UPDATE USER DETAILS (like name, phone, etc.)
    updateUserDetails: async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body;

        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        // prevent tampering
        delete updates._id;
        delete updates.email;
        delete updates.password;
        delete updates.role;
        delete updates.status;

        const result = await users.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        return res.status(200).json({
          message: "User details updated",
          modified: result.modifiedCount,
        });
      } catch (err) {
        console.error("❌ Failed to update user:", err);
        return res.status(500).json({ message: "Failed to update user details", error: err.message });
      }
    },

    // ✅ RESTORE USER (set status back to active)
    restoreUser: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid user ID" });

        const result = await users.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "active" } }
        );

        return res.status(200).json({
          message: "User restored",
          modified: result.modifiedCount,
        });
      } catch (err) {
        console.error("❌ Failed to restore user:", err);
        return res.status(500).json({ message: "Failed to restore user", error: err.message });
      }
    },
  };
};
