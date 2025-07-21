import registerHandler from "./handlers/register.js";
import loginHandler from "./handlers/login.js";
import logoutHandler from "./handlers/logout.js";
import getCurrentUserHandler from "./handlers/getCurrentUser.js";
import refreshTokenHandler from "./handlers/refreshToken.js";

export const createAuthController = (users, sessions, db) => ({
  register: (req, res) => registerHandler(req, res, users, sessions, db),
  login: (req, res) => loginHandler(req, res, users, sessions),
  logout: (req, res) => logoutHandler(req, res, sessions),
  refreshToken: (req, res) => refreshTokenHandler(req, res, users, sessions),
  getCurrentUser: (req, res) => getCurrentUserHandler(req, res, users),
});
  