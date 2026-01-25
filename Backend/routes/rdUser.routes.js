import express from "express";

import {
  addNomine,
  registerUser,
  startRd,
  checkUser,
  checkNominee,
  rdInfromation,
  closeRdAccount,
  payBackstatus,
} from "../controllers/rdUser.controller.js";
import { protectedRoutes } from "../middleware/CheckUserRegisterornot.js";

const routes = express.Router();

routes.post("/registeruser", registerUser);
routes.post("/check", checkUser);
routes.get("/nomineeAdd/:accountNumber", checkNominee);
routes.get("/rdinformation/:account_number", rdInfromation);
routes.get("/rdpayback/:account_number", protectedRoutes, payBackstatus);
routes.post("/addnominee/:account_number", protectedRoutes, addNomine);
routes.post("/startrd/:account_number", protectedRoutes, startRd);
routes.post("/close/:account_number", protectedRoutes, closeRdAccount);

export default routes;
