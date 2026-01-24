import express from "express";

import {
  check,
  login,
  logout,
  signup,
  profileData,
  verifyEmail,
  updateprofileData,
  editNomineeData,
  getNomineeData,
} from "../controllers/auth.controller.js";
import { protectedRoutes } from "../middleware/CheckUserRegisterornot.js";
const routes = express.Router();

routes.post("/login", login);
routes.post("/signup", signup);
routes.get("/profile/:email", profileData);
routes.get("/getnomineedata/:email", protectedRoutes, getNomineeData);
routes.post("/updateprofile/:email", updateprofileData);
routes.post("/editnominee/:email", editNomineeData);
routes.get("/verify/:token", verifyEmail);
routes.get("/logout", logout);
routes.get("/check", check);

export default routes;
