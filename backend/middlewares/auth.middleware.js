import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//* Check if user is logged in
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

//* Check if logged in user is admin

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

//* Make sure a user can only access their own data
export const sameUser = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;

  if (!userId || userId !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You can only access your own data",
    });
  }

  next();
};
