import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { AccountsView } from "@/components/dashboard/views/accounts-view";

export default async function DashboardAccountsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const usersRaw = await prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      role: true,
      member: { include: { subClub: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const accounts = usersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    username: u.username,
    role: u.role?.name ?? "USER",
    subClubName: u.member?.subClub?.name ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return <AccountsView accounts={accounts} />;
}
