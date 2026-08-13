import { prisma } from "./prisma";

/**
 * Centralized audit logger to record sensitive actions.
 * Never throws an error to prevent breaking business logic, but logs to console on failure.
 */
export const logAuditAction = async (params: {
  userId: string | null;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any> | string;
  ipAddress?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details ? (typeof params.details === 'string' ? params.details : JSON.stringify(params.details)) : null,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("[AuditLog Error] Failed to record action:", error);
  }
};
