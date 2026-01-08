import express from 'express';
import { optionController } from '../controllers/optionController.js';

const router = express.Router();

router.get('/menu/:menuId', optionController.getOptionsByMenuId);
router.get('/', optionController.getAllOptions);

export default router;
