import { z } from 'zod';

export const teamMemberSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    title: z.string().min(2, 'Title must be at least 2 characters long').optional(),
    role: z.string().min(2, 'Role must be at least 2 characters long').optional(),
    bio: z.string().optional(),
    qualification: z.string().optional(),
    memberType: z.enum(['TEAM', 'MENTOR', 'ADVISOR']).optional(),
    displayOrder: z.number().int().optional(),
    sortOrder: z.number().int().optional(),
    order: z.number().int().optional(),
    image: z.string().url('Invalid image URL').optional(),
    photoUrl: z.string().url('Invalid photo URL').optional(),
  }),
});
