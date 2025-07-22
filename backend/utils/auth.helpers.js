// utils/auth.helpers.js

import { ObjectId } from "mongodb";

/**
 * 🧼 Removes sensitive or internal fields from user before sending to client
 */
export const cleanUser = (user) => {
  if (!user) return null;

  return {
    _id: user._id?.toString() || user.id || "",
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
    isAdmin: ["admin", "superadmin"].includes(user.role),
    isSuperAdmin: user.role === "superadmin",
    status: user.status || "active",
    isVerified: user.isVerified ?? false,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
  };
};

/**
 * 🧨 Standardized error response utility
 */
export const handleError = (res, error, message = "An error occurred") => {
  console.error("❌", message, error);
  return res.status(500).json({
    message,
    error: error.message || error.toString(),
  });
};

/**
 * 🔍 Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  try {
    return new ObjectId(id).toString() === id.toString();
  } catch {
    return false;
  }
};
