import express from 'express';
import { inventoryController } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', inventoryController.getAllInventory);
router.patch('/:menuId', inventoryController.updateInventory);

export default router;
