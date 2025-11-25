// server/route/adminOrder.route.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

import {
  adminGetAllOrdersController,
  adminUpdateOrderStatusController,
  adminAssignDeliveryPersonController,
} from "../controllers/adminOrder.controller.js";

const adminOrderRouter = Router();

// ⭐ Get all orders (admin only)
adminOrderRouter.get("/list", auth, admin, adminGetAllOrdersController);

// ⭐ Update order status
adminOrderRouter.put("/update-status", auth, admin, adminUpdateOrderStatusController);

// ⭐ Assign delivery person
adminOrderRouter.put("/assign-delivery", auth, admin, adminAssignDeliveryPersonController);

export default adminOrderRouter;
