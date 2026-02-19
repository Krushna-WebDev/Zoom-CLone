import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import { registerSchema } from "../validators/auth.validator.js";
import nodemailer from "nodemailer";
dotenv.config();
export const register = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => err.message);
      return res.status(400).json({ errors: errorMessages });
    }

    const { name, email, password } = result.data;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const usercreated = await User.create({
      name,
      email,
      password: hashedpassword,
    });
    res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "all field required" });

  const FoundUser = await User.findOne({ email: email });
  if (!FoundUser) {
    return res.json({ message: "Provide Valid Email" });
  }

  const Match = await bcrypt.compare(password, FoundUser.password);
  if (!Match) {
    return res.status(401).json({ message: "enter correct password" });
  }
  const accessToken = jwt.sign(
    { id: FoundUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: FoundUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    // secure: false,
    // sameSite: "strict",
  });

  res.status(200).json({ accessToken, message: "login successfull" });
};

export const refresh = (req, res) => {
  const cookie = req.cookies.jwt;

  if (!cookie) return res.json({ message: "unauthorized" });

  jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    res.json({ accessToken });
  });
};

export const logout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    // secure: true,
    // sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

export const getuser = async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id }).select("-password");
  res.json({ user });
};

export const cookieCheck = (req, res) => {
  console.log(req.cookies);
};

export const GoogleLogin = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    // 1) Exchange code for Google tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:5000/api/v1/auth/google/callback",
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const { access_token } = tokenResponse.data;

    // 2) Fetch user profile from Google (more reliable than just decoding id_token)
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    const gUser = userInfoRes.data;
    // 3) Find or create user in DB
    let user = await User.findOne({ googleId: gUser.sub });

    if (!user) {
      // fallback: check if user exists by email (manual signup)
      user = await User.findOne({ email: gUser.email });
    }

    if (!user) {
      // create new user
      user = await User.create({
        name: gUser.name,
        email: gUser.email,
        googleId: gUser.sub,
        profilePic: gUser.picture,
      });
    } else if (!user.googleId) {
      // attach googleId if missing
      user.googleId = gUser.sub;
      await user.save();
    }

    // 4) Issue your own JWT access & refresh tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    // 5) Set refresh token in httpOnly cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6) Send accessToken + user info to frontend
    // res.json({
    //   accessToken,
    //   user: { name: user.name, email: user.email, picture: user.picture },
    //   message: "Login successful",
    // });
    res.redirect("http://localhost:5173");
  } catch (err) {
    console.error("Google login error:", err?.response?.data || err.message);
    res.status(500).send("Error during Google login");
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { curPassword } = req.body;
    if (!curPassword) {
      return res.status(400).json({ message: "current password required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "password managed by google" });
    }
    const isMatch = await bcrypt.compare(curPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid password" });
    }
    return res.status(200).json({ message: "password verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const changePass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "password managed by google" });
    }

    const newHashedPass = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: newHashedPass,
          otpVerified: false,
          otpVerifiedAt: null,
          otp: null,
          otpExpiry: null,
        },
      },
    );
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassWithOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.otpVerified || !user.otpVerifiedAt) {
      return res.status(400).json({ message: "Please verify OTP" });
    }

    const expiresAt = user.otpVerifiedAt + 5 * 60 * 1000;
    if (Date.now() > expiresAt) {
      return res.status(400).json({ message: "OTP Timeout" });
    }

    const newHashedPass = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: newHashedPass,
          otpVerified: false,
          otpVerifiedAt: null,
          otp: null,
          otpExpiry: null,
        },
      },
    );

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//pending
export const OTPSend = async (req, res) => {
  try {
    const userId = req.user.id;
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashOtp = await bcrypt.hash(otp, 10);

    const user = await User.findById(userId);
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          otp: hashOtp,
          otpExpiry: Date.now() + 5 * 60 * 1000,
        },
      },
      { new: true },
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "otp",
      text: otp,
    });
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;
    const user = await User.findById(userId).select("-password");
    if (Date.now() > user.otpExpiry)
      return res.status(400).json({ message: "Invalid Or Expired OTP" });

    const matchOtp = await bcrypt.compare(otp, user.otp);
    if (!matchOtp)
      return res.status(400).json({ message: "Invalid Or Expired OTP" });
    await User.updateOne(
      { _id: userId },
      { $set: { otpVerified: true, otpVerifiedAt: Date.now() } },
    );
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.log(error);
  }
};
