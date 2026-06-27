import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/authenticate.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { getMathLabs, createMathLab, updateMathLab } from '../controllers/mathlab.js';
import logger from '../utils/logger.js';

const router = express.Router();

const labStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edumeasy/labs',
    format: 'webp',
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const labUpload = multer({
  storage: labStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getMathLabs);
router.post('/', authenticate, createMathLab);
router.patch('/:id', authenticate, updateMathLab);

router.post('/upload', authenticate, uploadLimiter, labUpload.single('file'), (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator permissions required',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  logger.info({ path: req.file.path }, 'Lab asset uploaded successfully to Cloudinary');
  res.status(200).json({
    success: true,
    message: 'Lab asset uploaded successfully',
    url: req.file.path,
    publicId: req.file.filename,
  });
});

export default router;
