import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHead = req.headers.authorization;
  if (!authHead) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHead.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};
