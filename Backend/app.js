import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
const app = express();

const server = createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
  res.send("server running ");
});

server.listen(5000);
