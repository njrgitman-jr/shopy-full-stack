import express from "express";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";

import { getAdminDashboardStats } from "../controllers/adminDashboard.controller.js";

const router = express.Router();

// ADMIN OVERVIEW DASHBOARD
router.get("/overview", auth, admin, getAdminDashboardStats);

export default router;

