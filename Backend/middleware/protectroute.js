import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

const protectroute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    
    const decoded = jwt.verify(token, process.env.secret_code);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    console.log(decoded);
    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default protectroute;
