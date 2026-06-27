import '../config/env.js';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import valkey from '../config/valkey.js';
import logger from '../utils/logger.js';

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => valkey.call(...args),
    }),
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
      res.status(options.statusCode).send(options.message);
    },
  });
};

export const generalLimiter = createLimiter(
  15 * 60 * 1000,
  1000,
  'Too many requests, please try again later'
);

export const authLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many authentication attempts, please try again later'
);

export const enquiryLimiter = createLimiter(
  15 * 60 * 1000,
  50,
  'Too many enquiry submissions, please try again later'
);

export const orderLimiter = createLimiter(
  15 * 60 * 1000,
  50,
  'Too many order attempts, please try again later'
);

export const uploadLimiter = createLimiter(
  15 * 60 * 1000,
  50,
  'Too many upload attempts, please try again later'
);
