// server/route/admin-order.route.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  adminOrderListController,
  adminUpdateOrderStatusController,
  adminAssignDeliveryController,
  adminGetDeliveryPersonsController,
} from "../controllers/admin-order.controller.js";

const adminOrderRouter = Router();

// All routes require auth + admin role
adminOrderRouter.get("/list", auth, admin, adminOrderListController);
adminOrderRouter.put("/update-status", auth, admin, adminUpdateOrderStatusController);
adminOrderRouter.put("/assign-delivery", auth, admin, adminAssignDeliveryController);
adminOrderRouter.get("/delivery-persons", auth, admin, adminGetDeliveryPersonsController);

export default adminOrderRouter;
