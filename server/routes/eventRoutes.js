import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../validators/validate.js';
import { eventSchema } from '../validators/event.js';
import { listEvents, createEvent, updateEvent, deleteEvent } from '../controllers/event.js';

const router = express.Router();

router.get('/', listEvents);
router.post('/', authenticate, validate(eventSchema), createEvent);
router.patch('/:id', authenticate, validate(eventSchema), updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
