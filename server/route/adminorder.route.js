// server/route/adminorder.route.js
import { Router } from "express";
import { listOrders, updateOrder } from "../controllers/adminorder.controller.js";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const router = Router();

// GET /api/admin/orders?page=1&limit=10
router.get("/", auth, admin, listOrders);

// PUT /api/admin/orders/:id
router.put("/:id", auth, admin, updateOrder);

export default router;
