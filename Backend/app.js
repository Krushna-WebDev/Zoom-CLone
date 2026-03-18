import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./Routes/user.routes.js";
import meetingRoute from "./Routes/meeting.routes.js";
import bugReportRoute from "./Routes/bugReport.routes.js";
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
app.use("/images", express.static("/images"));

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
    socket.disconnect();
    return false;
  }
}

io.on("connection", async (socket) => {
  if (!(await validateUser(socket))) return;

  socket.on("offer", ({ offer, to, from }) => {
    if (!to) return;
    io.to(to).emit("offer", { offer, from });
  });

  socket.on("answer", ({ answer, to, from }) => {
    if (!to) return;
    io.to(to).emit("answer", { answer, from });
  });

  socket.on("ice-candidate", ({ candidate, to, from }) => {
    if (!to) return;
    io.to(to).emit("ice-candidate", { candidate, from });
  });

  socket.on("join-room", async ({ meetingId, name }) => {
    try {
      if (!(await validateUser(socket))) return;

      const meeting = await Meeting.findOne({ MeetingId: meetingId });
      if (!meeting) {
        socket.emit("error", "Meeting not found");
        return;
      }

      if (!roomUser[meetingId]) {
        roomUser[meetingId] = [];
      }

      const alreadyInRoom = roomUser[meetingId].some(
        (u) => u.socketId === socket.id,
      );

      if (!alreadyInRoom && roomUser[meetingId].length >= 3) {
        return;
      }

      const isCaller = socket.userId === meeting.Created_By;

      socket.join(meetingId);
      socket.meetingId = meetingId;
      socket.name = name;

      const userExists = meeting.Participants.some(
        (p) => p.userId.toString() === socket.userId,
      );
      const profilePic = socket.user?.profilePic || "/defaultProfile.jpg";
      if (!userExists) {
        await Meeting.updateOne(
          {
            MeetingId: meetingId,
            "Participants.userId": { $ne: socket.userId },
          },
          {
            $push: {
              Participants: {
                userId: socket.userId,
                name,
                email: socket.user.email,
                profilePic,
                role: isCaller ? "admin" : "member",
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

      if (deleteRoom[meetingId]) {
        clearTimeout(deleteRoom[meetingId]);
        delete deleteRoom[meetingId];
      }
      const exists = roomUser[meetingId].some((u) => u.socketId === socket.id);

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
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("send-message", async ({ meetingId, message }) => {
    try {
      if (!(await validateUser(socket))) return;
      const { name, userId } = socket;
      const cleanText = DOMPurify.sanitize(message);
      io.to(meetingId).emit("receive-message", {
        type: "Msg",
        user: name,
        text: cleanText,
        userId: socket.userId,
        Time: new Date(),
      });

      await Meeting.findOneAndUpdate(
        { MeetingId: meetingId },
        {
          $push: {
            Messages: {
              text: cleanText,
              senderId: userId,
              senderName: name,
            },
          },
        },
      );
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

      io.to(meetingId).emit("Connected-Users", {
        users: roomUser[meetingId] ?? [],
        // fallback admin id to first user in room (or null) so client shape stays consistent
        adminUserId: roomUser[meetingId]?.[0]?.userId ?? null,
      });
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
        socketId: socket.id,
        userId: socket.userId,
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
        socketId: socket.id,
        userId: socket.userId,
      });
      cleanupUser(meetingId, socket);
    } catch (error) {
      console.error("Error in disconnect:", error);
    }
  });
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/meeting", meetingRoute);
app.use("/api/v1/bug-report",bugReportRoute)
mongoose.connect(process.env.MONGODB_URI);
server.listen(process.env.PORT || 5000);
