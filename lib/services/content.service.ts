import { prisma } from '../prisma';
import { 
  createNewsSchema, 
  updateNewsSchema, 
  createProjectSchema, 
  updateProjectSchema,
  CreateNewsInput,
  UpdateNewsInput,
  CreateProjectInput,
  UpdateProjectInput
} from '../validations/content.schema';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

export class ContentService {
  // --- NEWS SERVICES ---

  static async getNews() {
    return prisma.news.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getNewsBySlug(slug: string) {
    const news = await prisma.news.findFirst({
      where: { slug, deletedAt: null }
    });

    if (!news) throw new NotFoundError('News not found');
    return news;
  }

  static async createNews(data: CreateNewsInput) {
    const parsedData = createNewsSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid news data', parsedData.error.flatten());
    }

    const { slug } = parsedData.data;

    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('News with this slug already exists');

    return prisma.news.create({
      data: parsedData.data
    });
  }

  static async updateNews(data: UpdateNewsInput) {
    const parsedData = updateNewsSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('News not found');

    if (updateData.slug && updateData.slug !== existing.slug) {
      const conflict = await prisma.news.findUnique({ where: { slug: updateData.slug } });
      if (conflict) throw new ConflictError('Slug is already in use');
    }

    return prisma.news.update({
      where: { id },
      data: updateData
    });
  }

  // --- PROJECT SERVICES ---

  static async getProjects() {
    return prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { club: true }
    });
  }

  static async getProjectBySlug(slug: string) {
    const project = await prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: { club: true }
    });

    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  static async createProject(data: CreateProjectInput) {
    const parsedData = createProjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid project data', parsedData.error.flatten());
    }

    const { slug, clubId } = parsedData.data;

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Project with this slug already exists');

    if (clubId) {
      const club = await prisma.club.findUnique({ where: { id: clubId } });
      if (!club) throw new NotFoundError('Club not found');
    }

    return prisma.project.create({
      data: parsedData.data
    });
  }

  static async updateProject(data: UpdateProjectInput) {
    const parsedData = updateProjectSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid project update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Project not found');

    if (updateData.slug && updateData.slug !== existing.slug) {
      const conflict = await prisma.project.findUnique({ where: { slug: updateData.slug } });
      if (conflict) throw new ConflictError('Slug is already in use');
    }

    if (updateData.clubId && updateData.clubId !== existing.clubId) {
      const club = await prisma.club.findUnique({ where: { id: updateData.clubId } });
      if (!club) throw new NotFoundError('Club not found');
    }

    return prisma.project.update({
      where: { id },
      data: updateData
    });
  }
}
