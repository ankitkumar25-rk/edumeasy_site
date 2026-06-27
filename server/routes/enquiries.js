import express from 'express';
import { enquiryLimiter } from '../middleware/rateLimiters.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../validators/validate.js';
import { enquirySchema } from '../validators/enquiry.js';
import { createEnquiry, getEnquiries } from '../controllers/enquiry.js';

const router = express.Router();

router.post('/', enquiryLimiter, validate(enquirySchema), createEnquiry);
router.get('/', authenticate, getEnquiries);

export default router;
