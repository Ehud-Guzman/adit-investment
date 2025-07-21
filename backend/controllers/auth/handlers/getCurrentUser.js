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

    return res.status(200).json(cleanUser(user));
  } catch (err) {
    handleError(res, err, "Failed to fetch current user");
  }
};

export default getCurrentUserHandler;
