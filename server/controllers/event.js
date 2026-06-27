import '../config/env.js';
import prisma from '../config/db.js';

export const listEvents = async (req, res, next) => {
  try {
    const { type, limit = 10, page = 1 } = req.query;

    const limitVal = parseInt(limit, 10);
    const pageVal = parseInt(page, 10);

    const baseWhere = type ? { type } : {};

    const now = new Date();
    let count = await prisma.event.count({
      where: {
        ...baseWhere,
        date: { gte: now },
      },
    });

    let whereClause = {
      ...baseWhere,
      date: { gte: now },
    };

    if (count === 0) {
      count = await prisma.event.count({ where: baseWhere });
      whereClause = baseWhere;
    }

    const totalPages = Math.ceil(count / limitVal);

    const data = await prisma.event.findMany({
      where: whereClause,
      skip: (pageVal - 1) * limitVal,
      take: limitVal,
      orderBy: { date: 'asc' },
    });

    res.status(200).json({
      success: true,
      count,
      page: pageVal,
      totalPages,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { title, description, type, date, scheduledAt, image, photoUrl, price, schedule, resourceLink } = req.body;

    const finalDate = date ? new Date(date) : (scheduledAt ? new Date(scheduledAt) : new Date());
    const finalImage = image || photoUrl || '';
    const finalPrice = price !== undefined ? parseFloat(price) : 0.0;
    const finalSchedule = schedule || resourceLink || '';

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        date: finalDate,
        image: finalImage,
        price: finalPrice,
        schedule: finalSchedule,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;
    const { title, description, type, date, image, price, schedule } = req.body;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (date !== undefined) updateData.date = new Date(date);
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (schedule !== undefined) updateData.schedule = schedule;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await prisma.event.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
