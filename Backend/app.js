import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import userRoute from "./Routes/user.routes.js";
import meetingRoute from "./Routes/meeting.routes.js";
dotenv.config();
const app = express();

app.use(cors());
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
  socket.on("join-room", ({ meetingId, userId, username }) => {
    socket.join(meetingId);

    if (!roomUser[meetingId]) {
      roomUser[meetingId] = [];
    }
    const exists = roomUser[meetingId].some((user) => user.userId === userId);
    if (!exists) {
      roomUser[meetingId].push({ userId, username });
    }
    console.log(roomUser[meetingId])
    io.to(meetingId).emit("Connected-Users", roomUser[meetingId]);
  });

  socket.on("send-message", ({ meetingId, message }) => {
    io.to(meetingId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/user", userRoute);
app.use("/api/v1/meeting", meetingRoute);
mongoose.connect(process.env.MONGODB_URI);
server.listen(process.env.PORT || 5000);
