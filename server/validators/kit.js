import { z } from 'zod';

export const kitSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Kit name must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    classRange: z.string().regex(/^Class\s+([6-9]|10)$/, 'Class range must target Class 6 through 10'),
    price: z.number().positive('Price must be greater than zero'),
    isActive: z.boolean().optional(),
  }),
});
