import express from 'express';
import { authLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../validators/validate.js';
import { registerSchema } from '../validators/auth.js';
import { register } from '../controllers/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);

router.post('/login', authLimiter, (req, res) => {
  logger.info('Mock login submission received');
  res.status(200).json({ success: true, message: 'Mock login successful' });
});

export default router;
