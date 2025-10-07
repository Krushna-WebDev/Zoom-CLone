import express from "express";
import { createMeeting } from "../Controllers/meeting.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

router.get("/create-meeting", verifyToken, createMeeting);

export default router;
