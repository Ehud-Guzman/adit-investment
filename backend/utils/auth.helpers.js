export const cleanUser = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  isVerified: user.isVerified,
  isAdmin: user.role === "admin" || user.role === "superadmin",
  createdAt: user.createdAt,
});



export const handleError = (res, err, msg = "Something went wrong", status = 500) => {
  console.error(`❌ ${msg}:`, err);
  res.status(status).json({ message: msg });
};
export const handleAuthError = (err) => {
  console.error("❌ Auth error:", err);
  if (err.response) {
    return { status: err.response.status, message: err.response.data.message };
  }
  return { status: 500, message: "Authentication failed" };
};
