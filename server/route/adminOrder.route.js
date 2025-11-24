import { Router } from "express";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import {
  adminGetAllOrders,
  adminUpdateOrder,
} from "../controllers/adminOrder.controller.js";

const adminOrderRouter = Router();

// GET ALL ORDERS (ADMIN ONLY)
adminOrderRouter.get("/orders", auth, admin, adminGetAllOrders);

// UPDATE ORDER INLINE (ADMIN ONLY)
adminOrderRouter.put("/orders/update", auth, admin, adminUpdateOrder);

export default adminOrderRouter;
