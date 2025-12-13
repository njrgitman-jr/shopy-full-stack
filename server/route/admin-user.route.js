import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  ADMIN_getAllUsers,
  ADMIN_changeUserRole,
  ADMIN_changeUserStatus,
  ADMIN_getUserLoginHistory,
} from "../controllers/admin-user.controller.js";

const adminUserRouter = Router();

// Only ADMIN can access
adminUserRouter.get("/list", auth, admin, ADMIN_getAllUsers);
adminUserRouter.put("/change-role", auth, admin, ADMIN_changeUserRole);
adminUserRouter.put("/change-status", auth, admin, ADMIN_changeUserStatus);
adminUserRouter.get("/login-history/:userId", auth, admin, ADMIN_getUserLoginHistory);

export default adminUserRouter;
