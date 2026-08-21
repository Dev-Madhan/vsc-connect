import { redirect } from "next/navigation";
import type { RoleEnum } from "@prisma/client";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SessionProvider, type SessionUser } from "@/lib/session-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// ─── Role label map ───────────────────────────────────────────────────────────
const ROLE_LABELS: Record<RoleEnum, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "President / VP",
  MODERATOR: "Sub-club Secretary",
  USER: "Member",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Verify session (middleware already gates the cookie, but double-check here)
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // 2. Load full user with role + member → subClub
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: true,
      member: {
        include: { subClub: true },
      },
    },
  });

  // Should never happen if DB is consistent, but guard anyway
  if (!dbUser) {
    redirect("/login");
  }

  const role: RoleEnum = dbUser.role?.name ?? "USER";

  // 3. Only allow roles that have dashboard access
  const ALLOWED_ROLES: RoleEnum[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];
  if (!ALLOWED_ROLES.includes(role)) {
    // Regular USER has no dashboard access
    redirect("/login?error=unauthorized");
  }

  const sessionUser: SessionUser = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image ?? null,
    username: dbUser.username ?? null,
    role,
    roleLabel: ROLE_LABELS[role],
    subClubName: dbUser.member?.subClub?.name ?? null,
    subClubSlug: dbUser.member?.subClub?.slug ?? null,
  };

  return (
    <SessionProvider user={sessionUser}>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}
