import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String },
  profilePic: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);

export default User;
