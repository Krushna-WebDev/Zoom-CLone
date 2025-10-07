import mongoose, { Schema } from "mongoose";

const MeetingSchema = new Schema({
  User_id: {
    type: String,
  },
MeetingId: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.model("Meeting",MeetingSchema)

export default Meeting
