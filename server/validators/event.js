import { z } from 'zod';

export const eventSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    type: z.enum(['EVENT', 'WORKSHOP', 'OLYMPIAD']),
    scheduledAt: z.string().datetime('Invalid ISO-8601 datetime format'),
    resourceLink: z.string().url('Invalid resource link URL').optional(),
  }),
});
