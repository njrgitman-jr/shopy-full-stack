// server/route/order.route.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  paymentController,
  webhookStripe,
} from "../controllers/order.controller.js";

// admin controller helpers (new)
import {
  getAllOrdersAdmin,
  getDeliveryPersonsForAssign,
  assignDeliveryPersonToOrder,
  updateOrderStatusAdmin,
} from "../controllers/adminOrder.controller.js";

const orderRouter = Router();

// public/user endpoints (existing)
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post("/checkout", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);
orderRouter.get("/order-list", auth, getOrderDetailsController);

// =====================
// Admin endpoints (use /api/order/* as requested)
// =====================
// GET all orders (admin)
orderRouter.get("/admin-list", auth, admin, getAllOrdersAdmin);

// GET delivery persons list (role = DELV)
orderRouter.get("/delivery-persons", auth, admin, getDeliveryPersonsForAssign);

// PUT assign delivery person to order
// body: { deliveryPersonId: "...", deliveryPersonName: "Name" }
orderRouter.put("/assign-delivery/:orderId", auth, admin, assignDeliveryPersonToOrder);

// PUT update status for order
// body: { status: "OutForDelivery" }
orderRouter.put("/update-status/:orderId", auth, admin, updateOrderStatusAdmin);

export default orderRouter;
