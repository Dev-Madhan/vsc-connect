import { z } from 'zod';

export const createClubSchema = z.object({
  name: z.string().min(2, "Club name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;

export const updateClubSchema = createClubSchema.partial().extend({
  id: z.string().uuid("Invalid club ID"),
});

export type UpdateClubInput = z.infer<typeof updateClubSchema>;

export const createSubClubSchema = z.object({
  name: z.string().min(2, "Sub-club name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  clubId: z.string().uuid("Invalid parent club ID"),
});

export type CreateSubClubInput = z.infer<typeof createSubClubSchema>;

export const updateSubClubSchema = createSubClubSchema.partial().extend({
  id: z.string().uuid("Invalid sub-club ID"),
});

export type UpdateSubClubInput = z.infer<typeof updateSubClubSchema>;
