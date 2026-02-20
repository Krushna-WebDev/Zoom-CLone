import express from "express";
import {
  changePass,
  changePassWithOtp,
  cookieCheck,
  emailVerify,
  getuser,
  GoogleLogin,
  login,
  logout,
  OTPSend,
  refresh,
  register,
  verifyOtp,
  verifyPassword,
} from "../Controllers/user.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getuser", verifyToken, getuser);
router.post("/verifyPassword", verifyToken, verifyPassword);
router.post("/emailverify", emailVerify);
router.post("/changepass", verifyToken, changePass);
router.post("/changepass-otp", verifyToken, changePassWithOtp);
router.get("/otpsend", verifyToken, OTPSend);
router.post("/verifyotp", verifyToken, verifyOtp);
router.get("/check", cookieCheck);
router.get("/refresh", refresh);
router.get("/google/callback", GoogleLogin);

export default router;
