import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { EventsView } from "@/components/dashboard/views/events-view";
import type { DashboardEventItem } from "@/components/dashboard/views/events-view";

export default async function DashboardEventsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: true,
      member: { include: { subClub: true } },
    },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role === "USER") redirect("/login?error=unauthorized");

  const isScoped = role === "MODERATOR";
  const subClubId = dbUser.member?.subClubId ?? null;

  const [eventsRaw, subClubs] = await Promise.all([
    prisma.event.findMany({
      where: {
        deletedAt: null,
        ...(isScoped && subClubId ? { clubId: subClubId } : {}),
      },
      include: {
        club: { select: { name: true } },
        participants: { select: { id: true } },
      },
      orderBy: { eventDate: "desc" },
    }),
    prisma.subClub.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const serialisedEvents: DashboardEventItem[] = eventsRaw.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description,
    eventDate: e.eventDate.toISOString(),
    location: e.location,
    status: e.status,
    clubName: e.club?.name ?? null,
    participantsCount: e.participants.length,
  }));

  return (
    <EventsView
      events={serialisedEvents}
      subClubs={subClubs}
      isScoped={isScoped}
    />
  );
}
