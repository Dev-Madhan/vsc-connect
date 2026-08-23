import { z } from 'zod';

// ── Existing: record a single-member OD ──────────────────────────────────────
export const createODSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  date: z.coerce.date({ message: "That's not a valid date" }),
  reason: z.string().min(5, 'Reason is too short').max(500),
  pdfUrl: z.string().url('Must be a valid PDF URL'),
});

export type CreateODInput = z.infer<typeof createODSchema>;

// ── OD Student row in the generation form ────────────────────────────────────
export const odStudentRowSchema = z.object({
  name:       z.string().min(1, 'Name is required'),
  vmNumber:   z.string().min(1, 'VM Number is required'),
  department: z.string().min(1, 'Department is required'),
  year:       z.string().min(1, 'Year is required'),
  subClubId:  z.string().min(1, 'Club is required'),
});

export type ODStudentRow = z.infer<typeof odStudentRowSchema>;

// ── Generate OD document (multi-student letter) ───────────────────────────────
export const generateODSchema = z.object({
  fromName:   z.string().min(2, 'From name is required').max(100),
  subject:    z.string().min(5, 'Subject is required').max(300),
  description: z.string().min(10, 'Description is required').max(2000),
  dateFrom:   z.string().min(1, 'Start date is required'),
  dateTo:     z.string().min(1, 'End date is required'),
  students:   z.array(odStudentRowSchema).min(1, 'Add at least one student'),
});

export type GenerateODInput = z.infer<typeof generateODSchema>;
