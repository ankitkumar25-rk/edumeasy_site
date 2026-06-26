import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })
);

const clientUrl = process.env.CLIENT_URL;
if (!clientUrl) {
  logger.fatal('CLIENT_URL is missing from environment variables');
  throw new Error('CLIENT_URL is missing from environment variables');
}

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10kb' }));

app.use('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'UP' });
});

app.use(errorHandler);

export default app;

