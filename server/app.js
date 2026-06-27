import './config/env.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

import { generalLimiter } from './middleware/rateLimiters.js';
import authRoutes from './routes/auth.js';
import enquiryRoutes from './routes/enquiries.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/uploads.js';
import galleryRoutes from './routes/galleryRoutes.js';
import teamRoutes from './routes/team.js';
import mathLabRoutes from './routes/mathLabRoutes.js';
import mathKitRoutes from './routes/mathKitRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

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

app.use(cookieParser());

app.use('/api', generalLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/mathlabs', mathLabRoutes);
app.use('/api/mathkits', mathKitRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10kb' }));

app.use('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'UP' });
});

app.use(errorHandler);

export default app;

