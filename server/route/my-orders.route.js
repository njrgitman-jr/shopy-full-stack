import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUserOrdersController } from "../controllers/my-orders.controller.js";

const router = Router();

router.get("/user-orders", auth, getUserOrdersController);

export default router;
