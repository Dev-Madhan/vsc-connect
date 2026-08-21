import { prisma } from '../prisma';
import {
  registerMemberSchema,
  updateMemberSchema,
  RegisterMemberInput,
  UpdateMemberInput,
} from '../validations/member.schema';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

export class MemberService {
  /**
   * Retrieves a member by their internal UUID, including sub-club data.
   */
  static async getMemberById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { subClub: true },
    });
    if (!member) throw new NotFoundError('Member not found');
    return member;
  }

  /**
   * Retrieves a member by their membership ID (e.g. VSC-2026-0001).
   */
  static async getMemberByMembershipId(membershipId: string) {
    const member = await prisma.member.findUnique({
      where: { membershipId },
      include: { subClub: true },
    });
    if (!member) throw new NotFoundError(`Member with ID '${membershipId}' not found`);
    return member;
  }

  /**
   * Returns all active (non-deleted) members for a given sub-club,
   * ordered by last name.
   */
  static async getMembersBySubClub(subClubId: string) {
    return prisma.member.findMany({
      where: { subClubId, deletedAt: null },
      include: { subClub: { select: { name: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  /**
   * Returns all active (non-deleted) members across the whole club,
   * ordered by last name. Used by ADMIN+ views.
   */
  static async getAllMembers() {
    return prisma.member.findMany({
      where: { deletedAt: null },
      include: { subClub: { select: { name: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  /**
   * Registers a new member.
   * Validates uniqueness of registerNumber, vmNumber, and email.
   * Auto-generates a VSC-{YEAR}-{4digits} membership ID.
   */
  static async registerMember(data: RegisterMemberInput) {
    const parsed = registerMemberSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError('Invalid registration data', parsed.error.flatten());
    }

    const d = parsed.data;

    // Check unique constraints in parallel
    const [existingReg, existingVm, existingEmail] = await Promise.all([
      prisma.member.findUnique({ where: { registerNumber: d.registerNumber } }),
      prisma.member.findUnique({ where: { vmNumber: d.vmNumber } }),
      prisma.member.findUnique({ where: { email: d.email } }),
    ]);

    if (existingReg) throw new ConflictError(`Register number '${d.registerNumber}' is already registered`);
    if (existingVm)  throw new ConflictError(`VM number '${d.vmNumber}' is already registered`);
    if (existingEmail) throw new ConflictError(`Email '${d.email}' is already registered`);

    // Validate sub-club if provided
    if (d.subClubId) {
      const sc = await prisma.subClub.findUnique({ where: { id: d.subClubId } });
      if (!sc) throw new NotFoundError('Selected sub-club does not exist');
    }

    // Generate unique membership ID — retry up to 5 times on collision
    const currentYear = new Date().getFullYear();
    let membershipId: string = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      const digits = String(Math.floor(1000 + Math.random() * 9000));
      const candidate = `VSC-${currentYear}-${digits}`;
      const conflict = await prisma.member.findUnique({ where: { membershipId: candidate } });
      if (!conflict) { membershipId = candidate; break; }
    }
    if (!membershipId) throw new ConflictError('Could not generate a unique membership ID — try again');

    return prisma.member.create({
      data: { ...d, membershipId },
      include: { subClub: { select: { name: true } } },
    });
  }

  /**
   * Updates an existing member's details (Admin or Secretary for their sub-club).
   */
  static async updateMember(data: UpdateMemberInput) {
    const parsed = updateMemberSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError('Invalid update data', parsed.error.flatten());
    }

    const { id, ...updateData } = parsed.data;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Member not found');

    if (updateData.email && updateData.email !== existing.email) {
      const conflict = await prisma.member.findUnique({ where: { email: updateData.email } });
      if (conflict) throw new ConflictError(`Email '${updateData.email}' is already in use`);
    }

    if (updateData.registerNumber && updateData.registerNumber !== existing.registerNumber) {
      const conflict = await prisma.member.findUnique({ where: { registerNumber: updateData.registerNumber } });
      if (conflict) throw new ConflictError(`Register number '${updateData.registerNumber}' is already in use`);
    }

    if (updateData.vmNumber && updateData.vmNumber !== existing.vmNumber) {
      const conflict = await prisma.member.findUnique({ where: { vmNumber: updateData.vmNumber } });
      if (conflict) throw new ConflictError(`VM number '${updateData.vmNumber}' is already in use`);
    }

    if (updateData.subClubId && updateData.subClubId !== existing.subClubId) {
      const sc = await prisma.subClub.findUnique({ where: { id: updateData.subClubId } });
      if (!sc) throw new NotFoundError('Selected sub-club does not exist');
    }

    return prisma.member.update({
      where: { id },
      data: updateData,
      include: { subClub: { select: { name: true } } },
    });
  }

  /**
   * Soft-deletes a member (sets deletedAt). Used for removal requests.
   */
  static async removeMember(id: string) {
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Member not found');

    return prisma.member.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }
}
