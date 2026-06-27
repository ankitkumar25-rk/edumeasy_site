import '../config/env.js';
import prisma from '../config/db.js';

export const listMathKits = async (req, res, next) => {
  try {
    const { classNumber, forClass, limit = 10, page = 1 } = req.query;

    const targetClass = classNumber || forClass;

    const where = {
      isDeleted: false,
      ...(targetClass ? { classNumber: parseInt(targetClass, 10) } : {}),
    };

    const count = await prisma.mathKit.count({ where });
    const totalPages = Math.ceil(count / limit);

    const data = await prisma.mathKit.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count,
      page,
      totalPages,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMathKitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const kit = await prisma.mathKit.findFirst({
      where: { id, isDeleted: false },
      include: {
        images: true,
      },
    });

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: 'Math kit not found',
      });
    }

    res.status(200).json({
      success: true,
      data: kit,
    });
  } catch (error) {
    next(error);
  }
};

export const createMathKit = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { title, description, price, forClass, classNumber, videoUrl, demoVideoUrl, images } = req.body;

    const finalClass = forClass !== undefined ? parseInt(forClass, 10) : (classNumber !== undefined ? parseInt(classNumber, 10) : 0);
    const priceInRupees = price ? price / 100 : 0;
    const finalVideoUrl = videoUrl || demoVideoUrl || '';

    const kit = await prisma.mathKit.create({
      data: {
        title,
        description,
        price: priceInRupees,
        classNumber: finalClass,
        videoUrl: finalVideoUrl,
        images: images ? { create: images } : undefined,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Math kit created successfully',
      data: kit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMathKit = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;
    const { title, description, price, demoVideoUrl, videoUrl, isActive } = req.body;

    const kit = await prisma.mathKit.findUnique({
      where: { id },
    });

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: 'Math kit not found',
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price / 100;
    if (demoVideoUrl !== undefined || videoUrl !== undefined) {
      updateData.videoUrl = demoVideoUrl || videoUrl;
    }
    if (isActive !== undefined) {
      updateData.isDeleted = !isActive;
    }

    const updatedKit = await prisma.mathKit.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Math kit updated successfully',
      data: updatedKit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMathKit = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;

    const kit = await prisma.mathKit.findUnique({
      where: { id },
    });

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: 'Math kit not found',
      });
    }

    await prisma.mathKit.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Math kit deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
