import express from 'express';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import upload from '../middleware/upload.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', uploadLimiter, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }
  logger.info({ file: req.file }, 'File uploaded successfully to Cloudinary');
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: req.file.path,
  });
});

export default router;
