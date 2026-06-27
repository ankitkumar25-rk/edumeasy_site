import express from 'express';
import { authLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/login', authLimiter, (req, res) => {
  logger.info('Mock login submission received');
  res.status(200).json({ success: true, message: 'Mock login successful' });
});

export default router;
