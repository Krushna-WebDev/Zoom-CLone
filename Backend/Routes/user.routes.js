import express from "express";
import { cookieCheck, getuser, GoogleLogin, login, logout, refresh, register } from "../Controllers/user.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();
router.get("/getuser",verifyToken ,getuser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", cookieCheck);

router.get("/refresh", refresh);
router.get("/google/callback",GoogleLogin)


export default router;
