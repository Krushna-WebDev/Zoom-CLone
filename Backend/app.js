import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./Routes/user.routes.js";
import meetingRoute from "./Routes/meeting.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomUser = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ meetingId, userId, name }) => {
    socket.join(meetingId);

    if (!roomUser[meetingId]) {
      roomUser[meetingId] = [];
    }
    const exists = roomUser[meetingId].some((user) => user.userId === userId);
    if (!exists) {
      roomUser[meetingId].push({ userId, name });
    }
   
    io.to(meetingId).emit("Connected-Users", roomUser[meetingId]);
  });

  socket.on("send-message", ({ meetingId, message }) => {
    io.to(meetingId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/meeting", meetingRoute);
mongoose.connect(process.env.MONGODB_URI);
server.listen(process.env.PORT || 5000);
