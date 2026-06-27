import express from 'express';
import { orderLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../validators/validate.js';
import { checkoutSchema } from '../validators/order.js';
import { createOrder } from '../controllers/order.js';

const router = express.Router();

router.post('/', orderLimiter, validate(checkoutSchema), createOrder);

export default router;
