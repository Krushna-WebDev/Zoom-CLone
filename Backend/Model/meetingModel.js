import mongoose from "mongoose";
import { string } from "zod";

const ParticipantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    profilePic:string,
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { _id: false }
);

const MeetingSchema = new mongoose.Schema({
  Created_By: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  MeetingId: { type: String, required: true },
  Participants: [ParticipantSchema],
  Date: { type: Date, default: Date.now },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
