// utils/auth.helpers.js

import { ObjectId } from "mongodb";

/**
 * 🧼 Clean and normalize user data for client or internal use
 * Ensures required identity fields (userId, _id) are preserved
 */
export const cleanUser = (user) => {
  if (!user || typeof user !== "object") return null;

  const id = user._id?.toString?.() || user.id?.toString?.() || "";

  return {
    _id: id,
    userId: id, // 🔐 Required for downstream route access
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "user",
    isAdmin: ["admin", "superadmin"].includes(user.role),
    isSuperAdmin: user.role === "superadmin",
    status: user.status ?? "active",
    isVerified: !!user.isVerified,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  };
};

/**
 * 🧨 Standardized error responder
 * Logs and sends a 500 response with error details
 */
export const handleError = (res, error, message = "An unexpected error occurred") => {
  const errorMessage = error?.message || error?.toString() || "Unknown error";
  console.error("❌", message, errorMessage);

  return res.status(500).json({
    success: false,
    message,
    error: errorMessage,
  });
};

/**
 * 🔍 Safely validate a MongoDB ObjectId
 * Prevents crashing from malformed or non-string input
 */
export const isValidObjectId = (id) => {
  if (!id || typeof id !== "string") return false;

  try {
    const objId = new ObjectId(id);
    return objId.toString() === id;
  } catch {
    return false;
  }
};
