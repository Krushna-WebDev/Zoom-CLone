import { v4 as uuidv4 } from "uuid";
import Meeting from "../Model/meetingModel.js";

export const createMeeting = async (req, res) => {
  const userId = req.userId;
  const meetingId = uuidv4();
  const meeting = new Meeting({ MeetingId: meetingId, User_id: userId.id });
  await meeting.save();
  res.json({ meetingid: meetingId });
};
