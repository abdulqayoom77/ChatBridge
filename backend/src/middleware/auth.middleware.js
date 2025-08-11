import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    console.log("🔍 Auth middleware called");
    console.log("📝 Cookies:", req.cookies);

    const token = req.cookies.jwt;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    console.log("🔑 Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      console.log("❌ Token verification failed");
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    console.log("✅ Token verified, finding user...");
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    console.log("✅ User authenticated:", user.fullName);
    req.user = user;

    next();
  } catch (error) {
    console.log("❌ Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
