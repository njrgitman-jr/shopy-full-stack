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

// All routes protected by auth + admin middleware
// GET /api/admin/order/get?page=1&limit=10
router.get("/get", auth, admin, getOrdersAdmin);

// PUT /api/admin/order/assign
router.put("/assign", auth, admin, assignDeliveryPerson);

// PUT /api/admin/order/update-status
router.put("/update-status", auth, admin, updateOrderStatus);

// GET /api/admin/order/get/:orderId
router.get("/get/:orderId", auth, admin, getOrderByOrderId);

export default router;
