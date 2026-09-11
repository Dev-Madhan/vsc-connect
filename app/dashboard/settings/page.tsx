import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SettingsView } from "@/components/dashboard/views/settings-view";

export default async function DashboardSettingsPage() {
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

  return <SettingsView />;
}
