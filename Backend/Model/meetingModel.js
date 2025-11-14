import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const MeetingSchema = new Schema({
  Created_By: {
    type: String,
  },
  MeetingId: {
    type: String,
    required: true,
  },

  Participants: [
    {
      userId: String,
      name: String,
      email: String,
      role: { type: String, enum: ["admin", "member"], default: "member" },
    },
  ],
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
