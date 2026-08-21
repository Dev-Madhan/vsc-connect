import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SubClubMembersView } from "@/components/dashboard/views/sub-club-members-view";

/**
 * /dashboard/members — server component.
 *
 * Resolves the secretary's sub-club from the session, fetches all
 * members for that sub-club, then hands off to the client view.
 * ADMIN / SUPER_ADMIN users see all members across all sub-clubs.
 */
export default async function MembersPage() {
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

  // USER has no access
  if (role === "USER") redirect("/login?error=unauthorized");

  // ── Resolve scope ─────────────────────────────────────────────────────────
  // MODERATOR → scoped to their sub-club
  // ADMIN / SUPER_ADMIN → all sub-clubs (subClubId = null means fetch all)
  const isScoped = role === "MODERATOR";
  const secretarySubClubId = dbUser.member?.subClub?.id ?? null;
  const secretarySubClubName = dbUser.member?.subClub?.name ?? null;

  if (isScoped && !secretarySubClubId) {
    // Secretary not assigned to a sub-club — show empty state
    return (
      <SubClubMembersView
        subClubId=""
        subClubName="Unassigned"
        members={[]}
        isScoped
      />
    );
  }

  // ── Fetch members ─────────────────────────────────────────────────────────
  const members = await prisma.member.findMany({
    where: {
      deletedAt: null,
      ...(isScoped ? { subClubId: secretarySubClubId! } : {}),
    },
    include: { subClub: { select: { id: true, name: true } } },
    orderBy: { lastName: "asc" },
  });

  // ── Fetch all sub-clubs for the form dropdown ─────────────────────────────
  const allSubClubs = await prisma.subClub.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const serialisedMembers = members.map((m) => ({
    id: m.id,
    membershipId: m.membershipId,
    registerNumber: m.registerNumber,
    vmNumber: m.vmNumber,
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    phoneNumber: m.phoneNumber,
    department: m.department,
    gender: m.gender as string,
    year: m.year as string,
    status: m.status as string,
    subClubId: m.subClubId,
    subClubName: m.subClub?.name ?? null,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <SubClubMembersView
      subClubId={isScoped ? secretarySubClubId! : "all"}
      subClubName={isScoped ? secretarySubClubName! : "All Sub-clubs"}
      members={serialisedMembers}
      allSubClubs={allSubClubs}
      isScoped={isScoped}
    />
  );
}
