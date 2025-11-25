import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/adminOrder.controller.js';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.get('/orders', auth, admin, getAllOrders);
router.put('/orders/:orderId', auth, admin, updateOrderStatus);

export default router;
