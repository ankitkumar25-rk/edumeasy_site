import '../config/env.js';
import prisma from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
  const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
  return lastDotIndex === -1 ? publicIdWithExtension : publicIdWithExtension.substring(0, lastDotIndex);
};

export const getTeamMembers = async (req, res, next) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    const grouped = {
      TEAM: [],
      MENTOR: [],
      ADVISOR: [],
    };

    members.forEach((member) => {
      if (grouped[member.role]) {
        grouped[member.role].push(member);
      }
    });

    res.status(200).json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { name, title, qualification, bio, role, memberType, image, photoUrl, sortOrder, order } = req.body;

    const finalName = name || title;
    const finalQualification = qualification || bio || '';
    const finalRole = role || memberType;
    const finalImage = image || photoUrl || '';
    const finalSortOrder = sortOrder !== undefined ? sortOrder : (order !== undefined ? order : 0);

    if (!finalName || !finalRole) {
      return res.status(400).json({
        success: false,
        message: 'Name and Role are required',
      });
    }

    const member = await prisma.teamMember.create({
      data: {
        name: finalName,
        qualification: finalQualification,
        role: finalRole,
        image: finalImage,
        sortOrder: finalSortOrder,
      },
    });

    logger.info({ memberId: member.id }, 'Team member created successfully');

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;
    const { name, title, qualification, bio, role, memberType, image, photoUrl, sortOrder, order } = req.body;

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    const updateData = {};
    if (name !== undefined || title !== undefined) updateData.name = name || title;
    if (qualification !== undefined || bio !== undefined) updateData.qualification = qualification || bio;
    if (role !== undefined || memberType !== undefined) updateData.role = role || memberType;
    if (image !== undefined || photoUrl !== undefined) updateData.image = image || photoUrl;
    if (sortOrder !== undefined || order !== undefined) {
      updateData.sortOrder = sortOrder !== undefined ? sortOrder : order;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    logger.info({ memberId: id }, 'Team member updated successfully');

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator permissions required',
      });
    }

    const { id } = req.params;

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    if (member.image) {
      const publicId = getPublicId(member.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          logger.error({ err, url: member.image }, 'Failed to delete asset from Cloudinary');
        }
      }
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    logger.info({ id }, 'Team member hard deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
