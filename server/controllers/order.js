import '../config/env.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '../config/db.js';
import logger from '../utils/logger.js';

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error('RAZORPAY_KEY_ID not set');
}
if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_SECRET not set');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
  try {
    const { items, buyerName, buyerEmail, buyerPhone, schoolName, city, state } = req.body;

    // 1. Generate Idempotency Key
    const sortedItems = [...items].sort((a, b) => a.kitId.localeCompare(b.kitId));
    const itemsString = JSON.stringify(sortedItems.map(item => ({ kitId: item.kitId, quantity: item.quantity })));
    const hashInput = `${buyerEmail}:${itemsString}`;
    const idempotencyKey = crypto.createHash('sha256').update(hashInput).digest('hex');

    // 2. Check for existing order
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
      include: {
        items: {
          include: {
            kit: true,
          },
        },
      },
    });

    if (existingOrder) {
      logger.info({ idempotencyKey }, 'Returning existing order via idempotent request');
      return res.status(200).json({
        success: true,
        message: 'Order already exists (idempotent)',
        data: existingOrder,
      });
    }

    // 3. Batch retrieve all kits to prevent N+1 queries
    const kitIds = items.map(item => item.kitId);
    const kits = await prisma.mathKit.findMany({
      where: {
        id: { in: kitIds },
        isActive: true,
        isDeleted: false,
      },
    });

    const kitMap = new Map(kits.map(kit => [kit.id, kit]));
    const orderItemsToCreate = [];
    let computedTotal = 0;

    for (const item of items) {
      const kit = kitMap.get(item.kitId);
      if (!kit) {
        return res.status(400).json({
          success: false,
          message: `Math kit with ID ${item.kitId} not found or is inactive`,
        });
      }

      const itemPrice = Number(kit.price);
      computedTotal += itemPrice * item.quantity;

      orderItemsToCreate.push({
        kitId: item.kitId,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // 4. Generate Razorpay Order
    let razorpayOrderId;
    try {
      const rpOrder = await razorpay.orders.create({
        amount: Math.round(computedTotal * 100), // in paise
        currency: 'INR',
        receipt: `rcpt_${idempotencyKey.substring(0, 20)}`,
      });
      razorpayOrderId = rpOrder.id;
    } catch (err) {
      logger.error({ err }, 'Failed to create Razorpay order');
      throw err;
    }

    // 5. Save order in DB
    const order = await prisma.order.create({
      data: {
        buyerName,
        buyerEmail,
        buyerPhone,
        schoolName,
        city,
        state,
        totalAmount: computedTotal,
        idempotencyKey,
        razorpayOrderId,
        items: {
          create: orderItemsToCreate,
        },
      },
      include: {
        items: {
          include: {
            kit: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
