import { verifyToken } from "../utils/jwt.util.js";
import User from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized Acess", success: false });
    }
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    req.user = decode;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found or session invalid", success: false });
    }
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error("authMiddleware token error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized", success: false });
  }
  next();
};

