import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const deliveryOrderRouter = Router();

import {
  getAssignedOrdersController,
  updateDeliveryStatusController,
} from "../controllers/delivery-order.controller.js";


// 🚚 delivery user (role = ADMIN or DELV)
deliveryOrderRouter.get("/my-assigned-orders", auth, getAssignedOrdersController);

deliveryOrderRouter.put("/update-delivery-status", auth, updateDeliveryStatusController);

export default deliveryOrderRouter;
