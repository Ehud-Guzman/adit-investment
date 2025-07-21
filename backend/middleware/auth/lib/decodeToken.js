import jwt from "jsonwebtoken";

/**
 * 🔐 decodeToken
 * Extracts and verifies a JWT from cookies, headers, or query parameters.
 *
 * @param {object} req - Express request object
 * @param {string} secret - JWT secret key
 * @param {string} [cookieName="token"] - Fallback cookie name
 * @returns {object} Decoded token with _tokenSource info
 */
export const decodeToken = (req, secret, cookieName = "token") => {
  let token = null;
  let source = "unknown";

  // 🧁 Priority 1: Cookie
  if (req.cookies?.[cookieName]) {
    token = req.cookies[cookieName];
    source = "cookie";
  }
  // 🪪 Priority 2: Authorization Header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    source = "header";
  }
  // 🔍 Priority 3: Query param
  else if (req.query?.token) {
    token = req.query.token;
    source = "query";
  }

  if (!token) {
    throw new Error("No authentication token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    err.message = `Token verification failed: ${err.message}`;
    throw err;
  }

  if (!decoded?.userId) {
    throw new Error("Invalid token payload: missing userId");
  }

  decoded._tokenSource = source;
  return decoded;
};
