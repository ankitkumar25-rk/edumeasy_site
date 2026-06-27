import express from 'express';
import { authLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../validators/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
import { register, login, refresh, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', authLimiter, logout);

export default router;
