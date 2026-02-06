import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    profilePic: String,
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { _id: false },
);

const MessageSchema = new mongoose.Schema({
  text: String,
  senderId: String,
  senderName: String,
  time: { type: Date, default: Date.now },
});

const MeetingSchema = new mongoose.Schema({
  Created_By: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  MeetingId: { type: String, required: true },
  MeetingName: { type: String, default: "Untitled Meeting" },
  Participants: [ParticipantSchema],
  Messages: { type: [MessageSchema], default: [] },
  Date: { type: Date, default: Date.now },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
