import { v4 as uuidv4 } from "uuid";
import Meeting from "../Model/meetingModel.js";
import User from "../Model/userModel.js";
import { roomUser } from "../config/roomManager.js";

export const createMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).select("-password");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name, email } = userData;
    const meetingId = uuidv4();

    const meeting = new Meeting({
      Created_By: userId,
      MeetingId: meetingId,
      Participants: { userId, name, email, role: "admin" },
    });

    await meeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meetingId: meetingId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const joinMeeting = async (req, res) => {
  const { meetingId } = req.body;
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password");
  const { name, email } = userData;

  const meeting = await Meeting.findOne({ MeetingId: meetingId });
  if (!meeting) return res.status(404).json({ message: "Meeting not found" });

  await Meeting.findOneAndUpdate(
    { MeetingId: meetingId },
    { $addToSet: { Participants: { userId, name, email, role: "member" } } },
  );
  res.status(200).json({ message: "Joined successfully" });
};

export const getParticipants = async (req, res) => {
  try {
    const { meetingId } = req.params;
    console.log("from backend", meetingId);

    const meeting = await Meeting.findOne({ MeetingId: meetingId }).select(
      "Participants",
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    res.json(meeting.Participants);
  } catch (err) {
    res.status(500).json({ error: "Error fetching participants" });
  }
};

export const checkRoomCapacity = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ MeetingId: meetingId });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    const currentUsers = roomUser[meetingId] ? roomUser[meetingId].length : 0;
    const isJoinable = currentUsers < 2;
    console.log("joinable",isJoinable)
    res.status(200).json({ isJoinable, currentUsers, maxUsers: 2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
