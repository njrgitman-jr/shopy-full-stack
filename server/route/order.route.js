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



const orderRouter = Router();

// public/user endpoints (existing)
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post("/checkout", auth, paymentController);
orderRouter.post("/webhook", webhookStripe);
orderRouter.get("/order-list", auth, getOrderDetailsController);



export default orderRouter;
