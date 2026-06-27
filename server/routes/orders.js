import express from 'express';
import { orderLimiter } from '../middleware/rateLimiters.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../validators/validate.js';
import { checkoutSchema } from '../validators/order.js';
import { createOrder, verifyOrderPayment, getOrderById } from '../controllers/order.js';

const router = express.Router();

router.post('/', orderLimiter, validate(checkoutSchema), createOrder);
router.post('/verify', verifyOrderPayment);
router.get('/:id', authenticate, getOrderById);

export default router;
