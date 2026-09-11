import { redirect } from "next/navigation";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { GalleryView } from "@/components/dashboard/views/gallery-view";
import type { AlbumItem } from "@/components/dashboard/views/gallery-view";

export default async function DashboardGalleryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!dbUser) redirect("/login");
  const role = dbUser.role?.name ?? "USER";
  if (role === "USER") redirect("/login?error=unauthorized");

  const albumsRaw = await prisma.gallery.findMany({
    where: { deletedAt: null },
    include: {
      images: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialisedAlbums: AlbumItem[] = albumsRaw.map((alb) => ({
    id: alb.id,
    title: alb.title,
    description: alb.description,
    images: alb.images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      caption: img.caption,
      createdAt: img.createdAt.toISOString(),
    })),
  }));

  return <GalleryView albums={serialisedAlbums} />;
}
