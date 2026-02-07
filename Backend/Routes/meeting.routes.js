import express from "express";
import {
  createMeeting,
  joinMeeting,
  getParticipants,
  checkRoomCapacity,
  MeetingHistory,
  fetchRecentMsg,
} from "../Controllers/meeting.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/create-meeting", verifyToken, createMeeting);
router.post("/join-meeting", verifyToken, joinMeeting);
router.get("/fetch-participants/:meetingId", verifyToken, getParticipants);
router.get("/fetchhistory", verifyToken, MeetingHistory);
router.get("/fetchRecentMsg/:meetingId", verifyToken, fetchRecentMsg);
router.get("/check-room/:meetingId", verifyToken, checkRoomCapacity);

export default router;
