import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/adminOrder.controller.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Admin-only route to get all orders
router.get('/orders', admin, getAllOrders);

// Admin-only route to update order status
router.put('/orders/:orderId', admin, updateOrderStatus);

export default router;
