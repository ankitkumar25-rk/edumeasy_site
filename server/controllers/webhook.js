import '../config/env.js';
import crypto from 'crypto';
import prisma from '../config/db.js';
import logger from '../utils/logger.js';

if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET not set');
}

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      logger.warn('Razorpay webhook header x-razorpay-signature is missing');
      return res.status(400).json({
        success: false,
        message: 'Missing signature header',
      });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
    hmac.update(req.body);
    const generatedSignature = hmac.digest('hex');

    const genBuf = Buffer.from(generatedSignature, 'utf-8');
    const sigBuf = Buffer.from(signature, 'utf-8');

    if (genBuf.length !== sigBuf.length || !crypto.timingSafeEqual(genBuf, sigBuf)) {
      logger.warn('Invalid Razorpay webhook signature verification attempt');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const payload = JSON.parse(req.body.toString('utf-8'));
    const { event } = payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;

      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayPaymentId },
      });

      if (existingPayment) {
        logger.info({ razorpayPaymentId }, 'Webhook payment already processed');
        return res.status(200).json({
          success: true,
          message: 'Event already processed',
        });
      }

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId },
      });

      if (!order) {
        logger.warn({ razorpayOrderId }, 'Order associated with webhook payment not found');
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            razorpayPaymentId,
            razorpaySignature: signature,
          },
        });
      });

      logger.info({ orderId: order.id }, 'Order paid successfully via webhook');
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;

      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayPaymentId },
      });

      if (existingPayment) {
        logger.info({ razorpayPaymentId }, 'Webhook failed payment already processed');
        return res.status(200).json({
          success: true,
          message: 'Event already processed',
        });
      }

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId },
      });

      if (order) {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'FAILED' },
          });

          await tx.payment.create({
            data: {
              orderId: order.id,
              razorpayPaymentId,
              razorpaySignature: signature,
            },
          });
        });
        logger.info({ orderId: order.id }, 'Order status marked as FAILED via webhook and payment stored');
      }
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    next(error);
  }
};
