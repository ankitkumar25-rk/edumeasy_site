import '../config/env.js';
import prisma from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

const getPublicId = (url) => {
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
  const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
  return lastDotIndex === -1 ? publicIdWithExtension : publicIdWithExtension.substring(0, lastDotIndex);
};

export const listGallery = async (req, res, next) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;

    const where = {
      deletedAt: null,
      ...(category ? { category } : {}),
    };

    const count = await prisma.gallery.count({ where });
    const totalPages = Math.ceil(count / limit);

    const data = await prisma.gallery.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
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

export const createGalleryItem = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { title, description, url, category } = req.body;

    const item = await prisma.gallery.create({
      data: {
        title,
        description,
        url,
        category,
      },
    });

    logger.info({ itemId: item.id }, 'Gallery item created successfully');

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;

    const item = await prisma.gallery.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    const publicId = getPublicId(item.url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        logger.error({ err, url: item.url }, 'Failed to delete asset from Cloudinary');
      }
    }

    await prisma.gallery.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info({ id }, 'Gallery item soft-deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
