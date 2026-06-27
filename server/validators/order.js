import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        kitId: z.string().uuid('Invalid kit ID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
      })
    ).min(1, 'Order must contain at least one item'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    address: z.string().min(10, 'Full shipping address is required'),
  }),
});
