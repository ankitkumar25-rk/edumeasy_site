import '../config/env.js';
import prisma from '../config/db.js';

export const createOrder = async (req, res, next) => {
  try {
        const { items, buyerName, buyerEmail, buyerPhone, address, schoolName, city, state } = req.body;

    const finalSchoolName = schoolName || address || 'Default School';
    const finalCity = city || 'Default City';
    const finalState = state || 'Default State';

    const orderItemsToCreate = [];
    let computedTotal = 0;

    for (const item of items) {
      const kit = await prisma.mathKit.findFirst({
        where: { id: item.kitId, isDeleted: false },
      });

      if (!kit) {
        return res.status(400).json({
          success: false,
          message: `Math kit with ID ${item.kitId} not found`,
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

        const order = await prisma.order.create({
      data: {
        buyerName,
        buyerEmail,
        buyerPhone,
        schoolName: finalSchoolName,
        city: finalCity,
        state: finalState,
        totalAmount: computedTotal,
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
