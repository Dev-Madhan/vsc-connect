import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal("")),
  publishedAt: z.coerce.date().optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;

export const updateNewsSchema = createNewsSchema.partial().extend({
  id: z.string().uuid("Invalid news ID"),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;

export const createProjectSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  clubId: z.string().uuid().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().uuid("Invalid project ID"),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
