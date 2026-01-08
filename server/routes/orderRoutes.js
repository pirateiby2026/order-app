import express from 'express';
import { orderController } from '../controllers/orderController.js';

const router = express.Router();

// 라우트 디버깅 미들웨어
router.use((req, res, next) => {
  console.log(`[주문 라우터] ${req.method} ${req.originalUrl} - 파라미터:`, req.params);
  next();
});

// 구체적인 라우트를 먼저 정의 (순서 중요!)
router.get('/statistics', orderController.getOrderStatistics);
router.delete('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);

export default router;
