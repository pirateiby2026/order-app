import express from 'express';
import { menuController } from '../controllers/menuController.js';

const router = express.Router();

router.get('/with-stock', menuController.getAllMenus);
router.get('/:id', menuController.getMenuById);
router.get('/', menuController.getAllMenus);

export default router;
