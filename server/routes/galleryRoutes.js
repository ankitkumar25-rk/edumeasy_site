import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../validators/validate.js';
import { galleryItemSchema, galleryQuerySchema } from '../validators/gallery.js';
import { listGallery, createGalleryItem, deleteGalleryItem } from '../controllers/gallery.js';

const router = express.Router();

router.get('/', validate(galleryQuerySchema), listGallery);
router.post('/', authenticate, uploadLimiter, validate(galleryItemSchema), createGalleryItem);
router.delete('/:id', authenticate, deleteGalleryItem);

export default router;
