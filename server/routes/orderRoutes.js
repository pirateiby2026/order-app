import express from 'express';
import { orderController } from '../controllers/orderController.js';

const router = express.Router();

router.get('/statistics', orderController.getOrderStatistics);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);

export default router;
