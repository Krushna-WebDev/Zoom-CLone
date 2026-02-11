import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHead = req.headers.authorization || req.headers.Authorization;
  if (!authHead) {
    return res.status(401).json({ msg: "No token provided" });
  }
  
  const token = authHead.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decode;

    next();
  } catch (error) {
    return res.status(403).json({ 
      msg: "Invalid or expired token",
      error: error.message
    });
  }
};