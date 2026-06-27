import express from 'express';
import { enquiryLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', enquiryLimiter, (req, res) => {
  logger.info('Mock enquiry submission received');
  res.status(201).json({ success: true, message: 'Mock enquiry submitted successfully' });
});

export default router;
