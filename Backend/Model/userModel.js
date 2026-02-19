import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Required only if no Google ID
    },
  },
  googleId: {
    type: String,
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  otpVerified: {
    type: Boolean,
  },
  otpVerifiedAt:{
    type:Date
  }
});

const User = mongoose.model("User", userSchema);

export default User;
