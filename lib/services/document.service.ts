import { prisma } from '../prisma';
import { 
  createODSchema, 
  CreateODInput 
} from '../validations/document.schema';
import { NotFoundError, ValidationError } from '../errors';

export class DocumentService {
  /**
   * Records a new OD document for a member
   */
  static async recordOD(data: CreateODInput) {
    const parsedData = createODSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError('Invalid OD document data', parsedData.error.flatten());
    }

    const { memberId, date, reason, pdfUrl } = parsedData.data;

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundError('Member not found');
    }

    return prisma.oDDocument.create({
      data: {
        memberId,
        date,
        reason,
        pdfUrl,
        type: 'OD'
      }
    });
  }

  /**
   * Retrieves all OD documents for a specific member
   */
  static async getMemberODs(memberId: string) {
    return prisma.oDDocument.findMany({
      where: { memberId, deletedAt: null },
      orderBy: { date: 'desc' }
    });
  }
}
