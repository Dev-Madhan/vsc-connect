import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { NotificationsView } from "@/components/dashboard/views/notifications-view";

export default async function DashboardNotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role === "USER") redirect("/login?error=unauthorized");

  const notifsRaw = await prisma.notification.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const serialised = notifsRaw.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationsView notifications={serialised} />;
}
