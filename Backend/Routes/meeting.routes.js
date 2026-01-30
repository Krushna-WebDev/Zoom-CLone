import express from "express";
import {
  createMeeting,
  joinMeeting,
  getParticipants,
  checkRoomCapacity,
  MeetingHistory,
} from "../Controllers/meeting.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

router.get("/create-meeting", verifyToken, createMeeting);
router.post("/join-meeting", verifyToken, joinMeeting);
router.get("/fetch-participants/:meetingId", verifyToken, getParticipants);
router.get("/fetchhistory", verifyToken, MeetingHistory);
router.get("/check-room/:meetingId", verifyToken, checkRoomCapacity);

export default router;
