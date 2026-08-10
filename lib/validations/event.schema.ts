import { z } from 'zod';
import { EventStatus } from '@prisma/client';

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  slug: z.string().min(3).max(150).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventDate: z.coerce.date({
    message: "That's not a valid date",
  }),
  location: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  clubId: z.string().uuid("Invalid club ID").optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid("Invalid event ID"),
  status: z.nativeEnum(EventStatus).optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const registerParticipantSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  memberId: z.string().uuid("Invalid member ID"),
});

export type RegisterParticipantInput = z.infer<typeof registerParticipantSchema>;

export const markAttendanceSchema = registerParticipantSchema.extend({
  attended: z.boolean(),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
