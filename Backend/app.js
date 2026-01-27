import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./Routes/user.routes.js";
import meetingRoute from "./Routes/meeting.routes.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import DOMPurify from "isomorphic-dompurify";
import Meeting from "./Model/meetingModel.js";
import { roomUser, deleteRoom } from "./config/roomManager.js";
import User from "./Model/userModel.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
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

// Helper function to validate user per event
async function validateUser(socket, callback) {
  try {
    const authToken = socket.handshake.auth;
    if (!authToken.token) {
      socket.disconnect();
      return false;
    }
    const decoded = jwt.verify(
      authToken.token,
      process.env.ACCESS_TOKEN_SECRET,
    );
    socket.userId = decoded.id;
    const user = await User.findById({ _id: socket.userId });
    socket.user = user;
    return true;
  } catch (error) {
    console.error("JWT validation failed:", error);
    socket.disconnect();
    return false;
  }
}

io.on("connection", (socket) => {
  if (!validateUser(socket)) return;

  socket.on("join-room", async ({ meetingId, name }) => {
    try {
      // Re-validate user on join
      if (!validateUser(socket)) return;

      const meeting = await Meeting.findOne({ MeetingId: meetingId });
      if (!meeting) {
        socket.emit("error", "Meeting not found");
        return;
      }

      if (!roomUser[meetingId]) {
        roomUser[meetingId] = [];
      }

      if (roomUser[meetingId].length >= 4) {
        console.log("max size reached");
        return;
      }

      const isCaller = socket.userId === meeting.Created_By;

      socket.join(meetingId);
      socket.meetingId = meetingId;
      socket.name = name;

      const userExists = await meeting.Participants.some(
        (p) => p.userId === socket.userId,
      );
      if (!userExists) {
        await Meeting.updateOne(
          { MeetingId: meetingId },
          {
            $addToSet: {
              Participants: {
                userId: socket.userId,
                name,
                // email,
                // role,
              },
            },
          },
        );
      }

      socket.emit("role", {
        isCaller,
        isAdmin: isCaller,
      });
      socket.to(meetingId).emit("userJoined", {
        type: "join",
        user: name,
      });

      socket.on("offer", ({ offer, meetingId }) => {
        socket.to(meetingId).emit("offer", offer);
      });

      socket.on("answer", ({ answer, meetingId }) => {
        socket.to(meetingId).emit("answer", answer);
      });

      socket.on("ice-candidate", ({ candidate, meetingId }) => {
        socket.to(meetingId).emit("ice-candidate", { candidate });
      });

      if (deleteRoom[meetingId]) {
        clearTimeout(deleteRoom[meetingId]);
        delete deleteRoom[meetingId];
      }

      console.log("socket me store user", socket.user);
      // Atomic check and add to prevent duplicates
      const exists = roomUser[meetingId].some(
        (u) => u.userId === socket.userId,
      );

      if (!exists) {
        roomUser[meetingId].push({
          userId: socket.userId,
          name,
          profilePic: socket.user.profilePic,
          socketId: socket.id,
        });
      }

      io.to(meetingId).emit("Connected-Users", {
        users: roomUser[meetingId],
        adminUserId: meeting.Created_By,
      });
    } catch (error) {
      console.error("Error in join-room:", error);
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("send-message", ({ meetingId, message }) => {
    try {
      if (!validateUser(socket)) return;
      const name = socket.name;
      const cleanText = DOMPurify.sanitize(message);
      io.to(meetingId).emit("receive-message", {
        type: "Msg",
        user: name,
        text: cleanText,
        userId: socket.userId,
      });
    } catch (error) {
      console.error("Error in send-message:", error);
    }
  });

  function cleanupUser(meetingId, socket) {
    try {
      if (!roomUser[meetingId]) return;

      roomUser[meetingId] = roomUser[meetingId].filter(
        (u) => u.socketId !== socket.id,
      );

      if (roomUser[meetingId].length === 0) {
        deleteRoom[meetingId] = setTimeout(() => {
          delete roomUser[meetingId];
          delete deleteRoom[meetingId];
        }, 60000);
      }

      io.to(meetingId).emit("Connected-Users", roomUser[meetingId] ?? []);
    } catch (error) {
      console.error("Error in cleanupUser:", error);
    }
  }

  socket.on("leave-room", (meetingId) => {
    try {
      socket.leave(meetingId);
      socket.to(meetingId).emit("userLeft", {
        type: "leave",
        user: socket.name,
      });

      cleanupUser(meetingId, socket);

      socket.emit("left-room-success");
    } catch (error) {
      console.error("Error in leave-room:", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      const meetingId = socket.meetingId;
      if (!meetingId) return;
      socket.to(meetingId).emit("userLeft", {
        type: "leave",
        user: socket.name,
      });
      cleanupUser(meetingId, socket);

      io.to(meetingId).emit("Connected-Users", roomUser[meetingId] ?? []);
    } catch (error) {
      console.error("Error in disconnect:", error);
    }
  });
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/meeting", meetingRoute);
mongoose.connect(process.env.MONGODB_URI);
server.listen(process.env.PORT || 5000);
