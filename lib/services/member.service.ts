import { prisma } from '../prisma';
import { 
  registerMemberSchema, 
  updateMemberSchema, 
  RegisterMemberInput, 
  UpdateMemberInput 
} from '../validations/member.schema';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

export class MemberService {
  /**
   * Retrieves a member by their ID with their sub-club relation
   */
  static async getMemberById(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { subClub: true }
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    return member;
  }

  /**
   * Retrieves a member by their membership ID (e.g. VSC-2026-001)
   */
  static async getMemberByMembershipId(membershipId: string) {
    const member = await prisma.member.findUnique({
      where: { membershipId },
      include: { subClub: true }
    });

    if (!member) {
      throw new NotFoundError(`Member with ID '${membershipId}' not found`);
    }

    return member;
  }

  /**
   * Registers a new member
   */
  static async registerMember(data: RegisterMemberInput) {
    const parsedData = registerMemberSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid registration data', parsedData.error.flatten());
    }

    const memberData = parsedData.data;

    // 1. Check for existing unique fields
    const [existingReg, existingEmail] = await Promise.all([
      prisma.member.findUnique({ where: { registerNumber: memberData.registerNumber } }),
      prisma.member.findUnique({ where: { email: memberData.email } })
    ]);

    if (existingReg) {
      throw new ConflictError(`Register number '${memberData.registerNumber}' is already registered`);
    }
    
    if (existingEmail) {
      throw new ConflictError(`Email '${memberData.email}' is already registered`);
    }

    // 2. Validate SubClub if provided
    if (memberData.subClubId) {
      const subClub = await prisma.subClub.findUnique({ where: { id: memberData.subClubId } });
      if (!subClub) {
        throw new NotFoundError('Selected sub-club does not exist');
      }
    }

    // 3. Generate a unique membership ID (Business Rule)
    // Format: VSC-{YEAR}-{RANDOM_4_DIGITS}
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const membershipId = `VSC-${currentYear}-${randomDigits}`;

    // 4. Create Member
    return prisma.member.create({
      data: {
        ...memberData,
        membershipId,
      }
    });
  }

  /**
   * Updates member details (Admin or self)
   */
  static async updateMember(data: UpdateMemberInput) {
    const parsedData = updateMemberSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Member not found');
    }

    // Check unique constraints if they are being updated
    if (updateData.email && updateData.email !== existing.email) {
      const conflict = await prisma.member.findUnique({ where: { email: updateData.email } });
      if (conflict) {
        throw new ConflictError(`Email '${updateData.email}' is already in use`);
      }
    }

    if (updateData.registerNumber && updateData.registerNumber !== existing.registerNumber) {
      const conflict = await prisma.member.findUnique({ where: { registerNumber: updateData.registerNumber } });
      if (conflict) {
        throw new ConflictError(`Register number '${updateData.registerNumber}' is already in use`);
      }
    }

    if (updateData.subClubId && updateData.subClubId !== existing.subClubId) {
      const subClub = await prisma.subClub.findUnique({ where: { id: updateData.subClubId } });
      if (!subClub) {
        throw new NotFoundError('Selected sub-club does not exist');
      }
    }

    return prisma.member.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Get all members for a specific subclub
   */
  static async getMembersBySubClub(subClubId: string) {
    return prisma.member.findMany({
      where: { subClubId, deletedAt: null },
      orderBy: { lastName: 'asc' }
    });
  }
}
