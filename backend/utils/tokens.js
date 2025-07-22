import jwt from "jsonwebtoken";

export const signAccessToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,         // ✅ now role is included in JWT
      isAdmin: user.isAdmin, 
      isSuperAdmin: user.isSuperAdmin,  // optional, keep if still used
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );



export const signRefreshToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role, // ✅ Optional, but smart for token rotation
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );


export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);


// ✅ Create a short-lived email verification token (10 mins)
export const signEmailVerificationToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.EMAIL_SECRET, // Should be different from JWT_SECRET
    { expiresIn: "10m" }
  );
};

// ✅ Verify the email token
export const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_SECRET);
};

