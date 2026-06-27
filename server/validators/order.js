import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        kitId: z.string().uuid('Invalid kit ID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Quantity cannot exceed 10'),
      })
    ).min(1, 'Order must contain at least one item'),
    buyerName: z.string().min(2, 'Name must be at least 2 characters long'),
    buyerEmail: z.string().email('Invalid email address'),
    buyerPhone: z.string().min(10, 'Phone number must be at least 10 characters long'),
    schoolName: z.string().min(2, 'School name must be at least 2 characters long'),
    city: z.string().min(2, 'City must be at least 2 characters long'),
    state: z.string().min(2, 'State must be at least 2 characters long'),
  }),
});
