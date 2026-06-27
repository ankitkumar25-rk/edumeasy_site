import '../config/env.js';
import { verifyAccessToken } from '../utils/paseto.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header is missing or invalid',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyAccessToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    logger.warn({ err }, 'Authentication failed: invalid token');
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
