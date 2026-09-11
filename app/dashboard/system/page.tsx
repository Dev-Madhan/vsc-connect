import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SystemAuditView } from "@/components/dashboard/views/system-audit-view";

export default async function DashboardSystemPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [
    totalUsers,
    totalMembers,
    totalEvents,
    totalODDocuments,
    totalAuditLogs,
    logsRaw,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.member.count({ where: { deletedAt: null } }),
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.oDDocument.count({ where: { deletedAt: null } }),
    prisma.auditLog.count({ where: { deletedAt: null } }),
    prisma.auditLog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const logs = logsRaw.map((l) => ({
    id: l.id,
    userId: l.userId,
    action: l.action,
    entity: l.entity,
    entityId: l.entityId,
    details: l.details,
    ipAddress: l.ipAddress,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <SystemAuditView
      stats={{
        totalUsers,
        totalMembers,
        totalEvents,
        totalODDocuments,
        totalAuditLogs,
        dbStatus: "Healthy",
      }}
      logs={logs}
    />
  );
}
