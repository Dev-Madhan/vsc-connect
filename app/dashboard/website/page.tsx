import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { WebsiteCMSView } from "@/components/dashboard/views/website-cms-view";

export default async function DashboardWebsitePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role === "USER") redirect("/login?error=unauthorized");

  const [newsRaw, projectsRaw, sponsorsRaw] = await Promise.all([
    prisma.news.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sponsor.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const news = newsRaw.map((n) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    content: n.content,
    createdAt: n.createdAt.toISOString(),
  }));

  const projects = projectsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    repoUrl: p.repoUrl,
    liveUrl: p.liveUrl,
  }));

  const sponsors = sponsorsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    logoUrl: s.logoUrl,
    websiteUrl: s.websiteUrl,
    tier: s.tier,
  }));

  return <WebsiteCMSView news={news} projects={projects} sponsors={sponsors} />;
}
