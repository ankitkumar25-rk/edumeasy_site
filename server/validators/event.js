import { z } from 'zod';

export const eventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
    type: z.enum(['EVENT', 'WORKSHOP', 'OLYMPIAD']).optional(),
    scheduledAt: z.string().datetime('Invalid ISO-8601 datetime format').optional(),
    date: z.string().optional(),
    resourceLink: z.string().optional(),
    image: z.string().optional(),
    price: z.number().optional(),
    schedule: z.string().optional(),
  }),
});
