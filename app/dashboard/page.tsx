import { redirect } from "next/navigation";
import type { RoleEnum } from "@prisma/client";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SuperAdminDashboard } from "@/components/dashboard/views/super-admin-dashboard";
import { AdminDashboard } from "@/components/dashboard/views/admin-dashboard";
import type { AdminDashboardProps } from "@/components/dashboard/views/admin-dashboard";
import { ModeratorDashboard } from "@/components/dashboard/views/moderator-dashboard";
import type { ModeratorDashboardStats } from "@/components/dashboard/views/moderator-dashboard";

/**
 * Dashboard home — server component that resolves the current user's role,
 * fetches role-appropriate data, and renders the matching view.
 */
export default async function DashboardPage() {
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

  const role: RoleEnum = dbUser.role?.name ?? "USER";

  switch (role) {
    case "SUPER_ADMIN":
      return <SuperAdminDashboard />;

    case "ADMIN": {
      const props = await fetchAdminDashboardProps();
      return <AdminDashboard {...props} />;
    }

    case "MODERATOR": {
      const subClubId = dbUser.member?.subClub?.id ?? null;
      let moderatorStats: ModeratorDashboardStats | undefined;
      if (subClubId) {
        const [total, active] = await Promise.all([
          prisma.member.count({ where: { subClubId, deletedAt: null } }),
          prisma.member.count({ where: { subClubId, deletedAt: null, status: "ACTIVE" } }),
        ]);
        moderatorStats = { totalMembers: total, activeMembers: active };
      }
      return (
        <ModeratorDashboard
          subClubName={dbUser.member?.subClub?.name ?? "Your Sub-Club"}
          subClubSlug={dbUser.member?.subClub?.slug ?? null}
          stats={moderatorStats}
        />
      );
    }

    default:
      // USER role — no dashboard access
      redirect("/login?error=unauthorized");
  }
}

// ─── Data fetcher for the Admin (President / VP) view ─────────────────────────

async function fetchAdminDashboardProps(): Promise<AdminDashboardProps> {
  const now = new Date();

  const [
    totalMembers,
    activeMembers,
    suspendedMembers,
    draftEvents,
    publishedEvents,
    upcomingEvents,
    totalNews,
    recentEvents,
    recentMembers,
  ] = await Promise.all([
    // Total non-deleted members
    prisma.member.count({ where: { deletedAt: null } }),

    // Active members
    prisma.member.count({ where: { deletedAt: null, status: "ACTIVE" } }),

    // Suspended members (proxy for removal requests)
    prisma.member.count({ where: { deletedAt: null, status: "SUSPENDED" } }),

    // Draft events
    prisma.event.count({ where: { deletedAt: null, status: "DRAFT" } }),

    // Published events
    prisma.event.count({ where: { deletedAt: null, status: "PUBLISHED" } }),

    // Upcoming published events (eventDate in the future)
    prisma.event.count({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        eventDate: { gte: now },
      },
    }),

    // Total non-deleted news articles
    prisma.news.count({ where: { deletedAt: null } }),

    // Recent events (draft + published, ordered by eventDate then createdAt)
    prisma.event.findMany({
      where: {
        deletedAt: null,
        status: { in: ["DRAFT", "PUBLISHED", "ONGOING"] },
      },
      orderBy: { eventDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        eventDate: true,
        status: true,
        location: true,
      },
    }),

    // Most recently registered members
    prisma.member.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        membershipId: true,
        createdAt: true,
        subClub: { select: { name: true } },
      },
    }),
  ]);

  return {
    stats: {
      totalMembers,
      activeMembers,
      suspendedMembers,
      draftEvents,
      publishedEvents,
      upcomingEvents,
      totalNews,
    },
    upcomingEvents: recentEvents.map((e) => ({
      id: e.id,
      title: e.title,
      eventDate: e.eventDate.toISOString(),
      status: e.status,
      location: e.location,
    })),
    recentMembers: recentMembers.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      membershipId: m.membershipId,
      subClubName: m.subClub?.name ?? null,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}
