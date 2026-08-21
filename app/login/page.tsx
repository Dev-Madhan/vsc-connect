import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/login-form";
import type { RoleEnum } from "@prisma/client";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

const DASHBOARD_ROLES: RoleEnum[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];

/**
 * If the user is already authenticated with a dashboard role, skip the login
 * page and send them straight to /dashboard (or the callbackUrl).
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  // Don't auto-redirect if there's an error param — let the user see the message
  if (!params.error) {
    const session = await getSession();
    if (session) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { role: true },
      });
      const role: RoleEnum = dbUser?.role?.name ?? "USER";
      if (DASHBOARD_ROLES.includes(role)) {
        redirect(params.callbackUrl ?? "/dashboard");
      }
    }
  }

  return <LoginForm error={params.error} />;
}
