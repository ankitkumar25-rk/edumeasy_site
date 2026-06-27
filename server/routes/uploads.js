import express from 'express';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', uploadLimiter, (req, res) => {
  logger.info('Mock file upload request received');
  res.status(200).json({ success: true, message: 'Mock file uploaded successfully' });
});

export default router;
