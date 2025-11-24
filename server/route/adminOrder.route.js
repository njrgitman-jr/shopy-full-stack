import { Router } from "express";
import { admin } from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import {
  adminGetAllOrders,
  adminUpdateOrder,
} from "../controllers/adminOrder.controller.js";

const adminorderRouter = Router();

// GET ALL ORDERS (ADMIN ONLY)
adminorderRouter.get("/orders", auth, admin, adminGetAllOrders);

// UPDATE ORDER INLINE (ADMIN ONLY)
adminorderRouter.put("/orders/update",  adminUpdateOrder);

export default adminorderRouter;
