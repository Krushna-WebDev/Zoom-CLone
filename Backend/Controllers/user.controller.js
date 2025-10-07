import mongoose from "mongoose";
import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existedUser = await User.findOne({ username });

  if (existedUser) {
    return res.status(400).json({ message: "user already Exist" });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  await User.create({
    username,
    email,
    password: hashedpassword,
  });
  res.json({ message: "user Created" });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ message: "Please Provide Detail" });
  }
  try {
    const existedUser = await User.findOne({ username });
    if (!existedUser) {
      return res.json({ message: "provide valid username" });
    }
    const cmprpass = await bcrypt.compare(password, existedUser.password);
    if (!cmprpass) {
      return res.json({ message: "enter correct password" });
    }
    const token = jwt.sign({ id: existedUser._id }, process.env.JWT_SECRET);
    res.json({ message: "login successfull", token });
  } catch (error) {
    res.status(500).json({ message: `something went wrong ${error}` });
  }
};

export const getuser = async (req, res) => {
  const userid = req.userId;

  const user = await User.findById({ _id: userid.id }).select("-password");

  res.status(200).json({ user });
};
