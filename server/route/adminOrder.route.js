// server/route/adminOrder.route.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  getOrdersAdmin,
  assignDeliveryPerson,
  updateOrderStatus,
  getOrderByOrderId,
} from "../controllers/adminOrder.controller.js";

const router = Router();

// All admin routes protected by auth + admin middleware
router.get("/get", auth, admin, getOrdersAdmin);
router.put("/assign", auth, admin, assignDeliveryPerson);
router.put("/update-status", auth, admin, updateOrderStatus);
router.get("/get/:orderId", auth, admin, getOrderByOrderId);

export default router;
