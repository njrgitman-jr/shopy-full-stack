import express from "express";
import { dashboardOverview } from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const dashboardRouter = express.Router();

// Base URL: /api/dashboard
dashboardRouter.get("/overview", auth, async (req, res) => {
  try {
    await dashboardOverview(req, res);
  } catch (error) {
    console.error("Error in /overview route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default dashboardRouter;
