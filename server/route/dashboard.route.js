import express from "express";
import { dashboardOverview } from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.js";
import {admin} from "../middleware/admin.js"

const dashboardRouter = express.Router();

// Base URL: /api/dashboard
dashboardRouter.get("/overview", auth, admin, dashboardOverview);

export default dashboardRouter;
