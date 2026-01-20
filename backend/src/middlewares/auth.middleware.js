import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Middleware to verify JWT and attach user to request
const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // Try cookie first
    if (req.cookies && req.cookies.token) token = req.cookies.token;

    // Then Authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.id)
      return res.status(401).json({ message: "Invalid token", success: false });

    // Optionally fetch full user from DB and attach
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", success: false });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({
        message: "Not authenticated",
        error: err.message,
        success: false,
      });
  }
};

export default isAuthenticated;
