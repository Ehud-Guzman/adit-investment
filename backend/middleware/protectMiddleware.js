import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cleanUser } from "../utils/auth.helpers.js";
import { connectDB } from "../config/db.js";

let usersCollection;

// Ensure we only connect once
async function getUsersCollection() {
  if (!usersCollection) {
    const collections = await connectDB();
    usersCollection = collections.users;
  }
  return usersCollection;
}

// 🔐 Base protect middleware
export const protect = () => async (req, res, next) => {
  let token;

  const users = await getUsersCollection();

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) return res.status(401).json({ message: "User not found" });

      req.userId = decoded.userId;
      req.user = cleanUser(user);
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) return res.status(401).json({ message: "User not found" });

      req.userId = decoded.userId;
      req.user = cleanUser(user);
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

// 🛡 Admin-only middleware
export const protectAdmin = () => async (req, res, next) => {
  await protect()(req, res, async () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  });
};
