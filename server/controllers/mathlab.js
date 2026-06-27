import '../config/env.js';
import prisma from '../config/db.js';

export const getMathLabs = async (req, res, next) => {
  try {
    const labs = await prisma.mathLab.findMany({
      where: { isDeleted: false },
      include: {
        equipment: true,
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      data: labs,
    });
  } catch (error) {
    next(error);
  }
};

export const createMathLab = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { title, description, price, level, videoUrl, images, equipment } = req.body;

    const lab = await prisma.mathLab.create({
      data: {
        title,
        description,
        price,
        level,
        videoUrl,
        images: images ? { create: images } : undefined,
        equipment: equipment ? { create: equipment.map(item => typeof item === 'string' ? { name: item } : item) } : undefined,
      },
      include: {
        equipment: true,
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Math lab created successfully',
      data: lab,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMathLab = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;
    const { title, description, price, level, videoUrl, isDeleted } = req.body;

    const lab = await prisma.mathLab.findUnique({
      where: { id },
    });

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Math lab not found',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (level !== undefined) updateData.level = level;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (isDeleted !== undefined) updateData.isDeleted = isDeleted;

    const updatedLab = await prisma.mathLab.update({
      where: { id },
      data: updateData,
      include: {
        equipment: true,
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Math lab updated successfully',
      data: updatedLab,
    });
  } catch (error) {
    next(error);
  }
};
