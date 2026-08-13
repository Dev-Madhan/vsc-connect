import { z } from 'zod';

export const createODSchema = z.object({
  memberId: z.string().uuid("Invalid member ID"),
  date: z.coerce.date({
    message: "That's not a valid date",
  }),
  reason: z.string().min(5, "Reason is too short").max(500),
  pdfUrl: z.string().url("Must be a valid PDF URL"),
});

export type CreateODInput = z.infer<typeof createODSchema>;
