import { prisma } from '../prisma';
import { 
  createClubSchema, 
  updateClubSchema, 
  createSubClubSchema, 
  updateSubClubSchema,
  CreateClubInput,
  UpdateClubInput,
  CreateSubClubInput,
  UpdateSubClubInput
} from '../validations/club.schema';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

export class ClubService {
  /**
   * Retrieves all clubs
   */
  static async getAllClubs() {
    return prisma.club.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Retrieves a specific club by its slug, including its active sub-clubs
   */
  static async getClubBySlug(slug: string) {
    const club = await prisma.club.findFirst({
      where: { slug, deletedAt: null },
      include: {
        subClubs: {
          where: { deletedAt: null },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!club) {
      throw new NotFoundError(`Club with slug '${slug}' not found`);
    }

    return club;
  }

  /**
   * Creates a new club
   */
  static async createClub(data: CreateClubInput) {
    // 1. Validate Input
    const parsedData = createClubSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid club data', parsedData.error.flatten());
    }

    const { slug, name, description, logoUrl } = parsedData.data;

    // 2. Check for conflicts
    const existing = await prisma.club.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new ConflictError(`Club with slug '${slug}' already exists`);
    }

    // 3. Execute business logic (Create)
    return prisma.club.create({
      data: {
        name,
        slug,
        description,
        logoUrl: logoUrl || null
      }
    });
  }

  /**
   * Updates an existing club
   */
  static async updateClub(data: UpdateClubInput) {
    const parsedData = updateClubSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid club update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.club.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Club not found');
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const conflict = await prisma.club.findUnique({ where: { slug: updateData.slug } });
      if (conflict) {
        throw new ConflictError(`Slug '${updateData.slug}' is already in use`);
      }
    }

    return prisma.club.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Soft deletes a club
   */
  static async deleteClub(id: string) {
    const existing = await prisma.club.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Club not found');
    }

    return prisma.club.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // --- SUB CLUB SERVICES ---

  static async getSubClubsByClubId(clubId: string) {
    return prisma.subClub.findMany({
      where: { clubId, deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }

  static async createSubClub(data: CreateSubClubInput) {
    const parsedData = createSubClubSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid sub-club data', parsedData.error.flatten());
    }

    const { slug, name, description, clubId } = parsedData.data;

    const parentClub = await prisma.club.findUnique({ where: { id: clubId } });
    if (!parentClub) {
      throw new NotFoundError('Parent club not found');
    }

    const existing = await prisma.subClub.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError(`Sub-club with slug '${slug}' already exists`);
    }

    return prisma.subClub.create({
      data: { name, slug, description, clubId }
    });
  }

  static async updateSubClub(data: UpdateSubClubInput) {
    const parsedData = updateSubClubSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid sub-club update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.subClub.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Sub-club not found');
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const conflict = await prisma.subClub.findUnique({ where: { slug: updateData.slug } });
      if (conflict) {
        throw new ConflictError(`Slug '${updateData.slug}' is already in use`);
      }
    }

    if (updateData.clubId && updateData.clubId !== existing.clubId) {
      const newParent = await prisma.club.findUnique({ where: { id: updateData.clubId } });
      if (!newParent) {
        throw new NotFoundError('New parent club not found');
      }
    }

    return prisma.subClub.update({
      where: { id },
      data: updateData
    });
  }
}
