import { z } from 'zod';
import { Gender, Year, MemberStatus } from '@prisma/client';

export const registerMemberSchema = z.object({
  registerNumber: z.string().min(3, "Register number is too short").max(30),
  vmNumber:       z.string().min(2, "VM number is required").max(30),
  firstName:      z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName:       z.string().min(1, "Last name is required").max(50),
  email:          z.string().email("Invalid email address"),
  phoneNumber:    z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number").optional().or(z.literal("")),
  department:     z.string().min(2, "Department is required").max(100),
  gender:         z.nativeEnum(Gender),
  year:           z.nativeEnum(Year),
  subClubId:      z.string().uuid("Invalid sub-club ID").optional(),
});

export type RegisterMemberInput = z.infer<typeof registerMemberSchema>;

export const updateMemberSchema = registerMemberSchema.partial().extend({
  id:     z.string().uuid("Invalid member ID"),
  status: z.nativeEnum(MemberStatus).optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
