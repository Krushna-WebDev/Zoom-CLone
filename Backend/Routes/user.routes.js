import express from "express";
import { getuser, login, register } from "../Controllers/user.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();
router.get("/getuser",verifyToken ,getuser);
router.post("/register", register);
router.post("/login", login);

export default router;
