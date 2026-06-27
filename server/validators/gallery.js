import { z } from 'zod';

export const galleryItemSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().optional(),
    url: z.string().url('Invalid asset URL'),
    category: z.enum(['IMAGE', 'VIDEO', 'TESTIMONIAL']),
  }),
});

export const galleryQuerySchema = z.object({
  query: z.object({
    category: z.enum(['IMAGE', 'VIDEO', 'TESTIMONIAL']).optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional(),
    page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  }),
});
