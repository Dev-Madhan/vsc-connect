"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createAlbumAction(title: string, description?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("MODERATOR");
    const gallery = await prisma.gallery.create({
      data: { title, description },
    });
    revalidatePath("/dashboard/gallery");
    return { ok: true, data: { id: gallery.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create album";
    return { ok: false, error: msg };
  }
}

export async function addImageToAlbumAction(input: {
  galleryId: string;
  imageUrl: string;
  caption?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("MODERATOR");
    const img = await prisma.galleryImage.create({
      data: {
        galleryId: input.galleryId,
        imageUrl: input.imageUrl,
        caption: input.caption,
      },
    });
    revalidatePath("/dashboard/gallery");
    return { ok: true, data: { id: img.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add image";
    return { ok: false, error: msg };
  }
}

export async function deleteImageAction(imageId: string): Promise<ActionResult> {
  try {
    await requireRole("MODERATOR");
    await prisma.galleryImage.delete({
      where: { id: imageId },
    });
    revalidatePath("/dashboard/gallery");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete image";
    return { ok: false, error: msg };
  }
}
