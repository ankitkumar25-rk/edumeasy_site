import { z } from 'zod';

export const enquirySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    message: z.string().min(10, 'Message must be at least 10 characters long'),
  }),
});
