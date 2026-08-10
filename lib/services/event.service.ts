import { prisma } from '../prisma';
import { 
  createEventSchema, 
  updateEventSchema, 
  registerParticipantSchema, 
  markAttendanceSchema,
  CreateEventInput,
  UpdateEventInput,
  RegisterParticipantInput,
  MarkAttendanceInput
} from '../validations/event.schema';
import { NotFoundError, ValidationError, ConflictError } from '../errors';

export class EventService {
  /**
   * Retrieves all published events
   */
  static async getPublishedEvents() {
    return prisma.event.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { eventDate: 'asc' },
      include: { club: true }
    });
  }

  /**
   * Retrieves a specific event by its slug
   */
  static async getEventBySlug(slug: string) {
    const event = await prisma.event.findFirst({
      where: { slug, deletedAt: null },
      include: { club: true }
    });

    if (!event) {
      throw new NotFoundError(`Event with slug '${slug}' not found`);
    }

    return event;
  }

  /**
   * Creates a new event (Defaults to DRAFT)
   */
  static async createEvent(data: CreateEventInput) {
    const parsedData = createEventSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid event data', parsedData.error.flatten());
    }

    const { slug, title, description, eventDate, location, imageUrl, clubId } = parsedData.data;

    const existing = await prisma.event.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new ConflictError(`Event with slug '${slug}' already exists`);
    }

    if (clubId) {
      const club = await prisma.club.findUnique({ where: { id: clubId } });
      if (!club) {
        throw new NotFoundError('Club not found');
      }
    }

    return prisma.event.create({
      data: {
        title,
        slug,
        description,
        eventDate,
        location,
        imageUrl: imageUrl || null,
        clubId: clubId || null
      }
    });
  }

  /**
   * Updates an existing event
   */
  static async updateEvent(data: UpdateEventInput) {
    const parsedData = updateEventSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid event update data', parsedData.error.flatten());
    }

    const { id, ...updateData } = parsedData.data;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Event not found');
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const conflict = await prisma.event.findUnique({ where: { slug: updateData.slug } });
      if (conflict) {
        throw new ConflictError(`Slug '${updateData.slug}' is already in use`);
      }
    }

    if (updateData.clubId && updateData.clubId !== existing.clubId) {
      const club = await prisma.club.findUnique({ where: { id: updateData.clubId } });
      if (!club) {
        throw new NotFoundError('Club not found');
      }
    }

    return prisma.event.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Registers a member for an event
   */
  static async registerParticipant(data: RegisterParticipantInput) {
    const parsedData = registerParticipantSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid participation data', parsedData.error.flatten());
    }

    const { eventId, memberId } = parsedData.data;

    const [event, member] = await Promise.all([
      prisma.event.findUnique({ where: { id: eventId } }),
      prisma.member.findUnique({ where: { id: memberId } })
    ]);

    if (!event) throw new NotFoundError('Event not found');
    if (!member) throw new NotFoundError('Member not found');

    const existing = await prisma.eventParticipant.findUnique({
      where: {
        eventId_memberId: { eventId, memberId }
      }
    });

    if (existing) {
      throw new ConflictError('Member is already registered for this event');
    }

    return prisma.eventParticipant.create({
      data: { eventId, memberId }
    });
  }

  /**
   * Marks attendance for an event participant
   */
  static async markAttendance(data: MarkAttendanceInput) {
    const parsedData = markAttendanceSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid attendance data', parsedData.error.flatten());
    }

    const { eventId, memberId, attended } = parsedData.data;

    const participation = await prisma.eventParticipant.findUnique({
      where: {
        eventId_memberId: { eventId, memberId }
      }
    });

    if (!participation) {
      throw new NotFoundError('Member is not registered for this event');
    }

    return prisma.eventParticipant.update({
      where: { id: participation.id },
      data: { attended }
    });
  }
}
