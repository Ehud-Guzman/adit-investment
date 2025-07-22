import { ObjectId } from "mongodb";
import { cleanUser, handleError } from "../../../utils/auth.helpers.js";

const getCurrentUserHandler = async (req, res, users) => {
  try {
    if (!req.user?.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await users.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const safeUser = cleanUser(user);
    const normalizedUser = {
      ...safeUser,
      role: user.isSuperAdmin
        ? "superadmin"
        : user.isAdmin
        ? "admin"
        : "user",
      isSuperAdmin: user.isSuperAdmin === true || user.isSuperAdmin === "true",
    };

    return res.status(200).json(normalizedUser);
  } catch (err) {
    handleError(res, err, "Failed to fetch current user");
  }
};

export default getCurrentUserHandler;
