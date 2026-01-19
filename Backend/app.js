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

const roomUser = {};
const deleteRoom = {
  // "roomnumber1":function of deletetion
  // "roomnumber2":function of deletetion
};

io.on("connection", (socket) => {
  const authToken = socket.handshake.auth; 
  if (!authToken.token) {
    socket.disconnect();
    console.log("socket disconnect");
    return;
  }
  const decoded = jwt.verify(authToken.token, process.env.ACCESS_TOKEN_SECRET);
  socket.userId = decoded.id;
  // replace all userid sending from frontend to this socket.userid and remove sending useridd from frotnend
  socket.on("join-room", ({ meetingId, userId, name, joinType }) => {
    socket.join(meetingId);
    socket.meetingId = meetingId;
    socket.name = name;

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

    if (!roomUser[meetingId]) {
      roomUser[meetingId] = [];
    }

    const exists = roomUser[meetingId].some((u) => u.userId === userId);
    if (!exists) {
      roomUser[meetingId].push({
        userId,
        name,
        socketId: socket.id,
        joinType,
      });
    }

    io.to(meetingId).emit("Connected-Users", roomUser[meetingId]);
  });

  socket.on("send-message", ({ meetingId, message, userId }) => {
    const name = socket.name;
    const cleanText = DOMPurify.sanitize(message);
    console.log("cleantext", cleanText);
    io.to(meetingId).emit("receive-message", {
      type: "Msg",
      user: name,
      text: cleanText,
      userId,
    });
  });
  // repeat ho raha hai yaha par fix chahiye(done)

  function cleanupUser(meetingId, socket) {
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
  }

  socket.on("leave-room", (meetingId) => {
    socket.leave(meetingId);
    socket.to(meetingId).emit("userLeft", {
      type: "leave",
      user: socket.name,
    });

    cleanupUser(meetingId, socket);

    socket.emit("left-room-success");
  });

  socket.on("disconnect", () => {
    const meetingId = socket.meetingId;
    if (!meetingId) return;
    socket.to(meetingId).emit("userLeft", {
      type: "leave",
      user: socket.name,
    });
    cleanupUser(meetingId, socket);

    io.to(meetingId).emit("Connected-Users", roomUser[meetingId] ?? []);
  });
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/meeting", meetingRoute);
mongoose.connect(process.env.MONGODB_URI);
server.listen(process.env.PORT || 5000);
