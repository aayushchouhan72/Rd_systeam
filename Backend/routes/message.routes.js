import express from "express";

import { getMessage } from "../controllers/message.controller.js";
const routes = express.Router();
routes.get("/getmessage/:userEmail", getMessage);
export default routes;
