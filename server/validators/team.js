import { z } from 'zod';

export const teamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    role: z.string().min(2, 'Role must be at least 2 characters long'),
    memberType: z.enum(['TEAM', 'MENTOR', 'ADVISOR']),
    displayOrder: z.number().int().min(1, 'Display order must be a positive integer'),
    image: z.string().url('Invalid image URL').optional(),
  }),
});
