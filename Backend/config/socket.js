import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import Message from "../model/chat.models.js";
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
  console.log("user us connected", socket.id);
  connectDB();
  // Backend/config/socket.js
  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        SenderID: data.senderId, // Matches your Schema key
        content: data.text, // Matches your Schema key
        messageType: "text",
      });
      await newMessage.save();
      // Broadcast to everyone else
      socket.broadcast.emit("receive_message", {
        id: newMessage._id,
        text: newMessage.content,
        sender: "other",
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io, app, server };
