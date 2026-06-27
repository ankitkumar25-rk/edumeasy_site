import './config/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import helmetConfig from './config/helmet.js';
import corsConfig from './config/cors.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

import { generalLimiter } from './middleware/rateLimiters.js';
import authRoutes from './routes/auth.js';
import enquiryRoutes from './routes/enquiries.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploads.js';
import galleryRoutes from './routes/galleryRoutes.js';
import teamRoutes from './routes/team.js';
import mathLabRoutes from './routes/mathLabRoutes.js';
import mathKitRoutes from './routes/mathKitRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();

app.use(helmetConfig);
app.use(corsConfig);
app.use(pinoHttp({ logger }));
app.use(cookieParser());

app.use('/api/webhook/razorpay', express.raw({ type: 'application/json' }));
app.use('/api/webhook/razorpay', webhookRoutes);

app.use(express.json({ limit: '10kb' }));

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

app.use('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.use(errorHandler);

export default app;
