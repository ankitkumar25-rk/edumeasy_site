import express from 'express';
import { orderLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', orderLimiter, (req, res) => {
  logger.info('Mock order checkout request received');
  res.status(201).json({ success: true, message: 'Mock checkout successful' });
});

export default router;
