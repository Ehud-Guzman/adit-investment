import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cleanUser } from "../utils/auth.helpers.js";

// Assuming users collection is passed or accessible globally
export const protect = (users) => async (req, res, next) => {
  let token;

  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      req.user = cleanUser(user);
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      req.user = cleanUser(user);
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};