import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import rdUserRoutes from "./routes/rdUser.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import messagesRoutes from "./routes/message.routes.js";

import { app, server } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

// MIDDLEWARES
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/rduser", rdUserRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/messages", messagesRoutes);

// SERVER START
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
