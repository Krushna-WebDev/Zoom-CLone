import express from "express";
import {
  changePass,
  cookieCheck,
  getuser,
  GoogleLogin,
  login,
  logout,
  OTPSend,
  refresh,
  register,
  verifyPassword,
} from "../Controllers/user.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getuser", verifyToken, getuser);
router.post("/verifyPassword", verifyToken, verifyPassword);
router.post("/changepass", verifyToken, changePass);
router.get("/otpsend", verifyToken, OTPSend);
router.get("/check", cookieCheck);
router.get("/refresh", refresh);
router.get("/google/callback", GoogleLogin);

export default router;
