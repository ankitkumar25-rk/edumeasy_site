import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/authenticate.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { listMathKits, getMathKitById, createMathKit, updateMathKit, deleteMathKit } from '../controllers/mathkit.js';
import logger from '../utils/logger.js';

const router = express.Router();

const kitStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edumeasy/kits',
    format: 'webp',
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const kitUpload = multer({
  storage: kitStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', listMathKits);
router.get('/:id', getMathKitById);
router.post('/', authenticate, createMathKit);
router.patch('/:id', authenticate, updateMathKit);
router.delete('/:id', authenticate, deleteMathKit);

router.post('/upload', authenticate, uploadLimiter, kitUpload.single('file'), (req, res) => {
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

  logger.info({ path: req.file.path }, 'Kit asset uploaded successfully to Cloudinary');
  res.status(200).json({
    success: true,
    message: 'Kit asset uploaded successfully',
    url: req.file.path,
    publicId: req.file.filename,
  });
});

export default router;
