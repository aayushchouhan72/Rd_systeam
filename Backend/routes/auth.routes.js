import express from "express";

import {
  check,
  login,
  logout,
  signup,
  profileData,
  verifyEmail,
} from "../controllers/auth.controller.js";
const routes = express.Router();

routes.post("/login", login);
routes.post("/signup", signup);
routes.get("/profile/:email", profileData);
routes.get("/verify/:token", verifyEmail);
routes.get("/logout", logout);
routes.get("/check", check);

export default routes;
