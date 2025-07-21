const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

export const accessCookieOptions = {
  ...baseCookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
