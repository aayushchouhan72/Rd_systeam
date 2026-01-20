import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./mongodb.js";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  connectDB();
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io, app, server };
