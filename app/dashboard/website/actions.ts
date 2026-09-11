"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { ContentService } from "@/lib/services/content.service";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// --- News Actions ---
export async function createNewsAction(input: {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("ADMIN");
    const item = await ContentService.createNews({
      title: input.title,
      slug: input.slug,
      content: input.content,
      imageUrl: input.imageUrl,
      publishedAt: new Date(),
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/news");
    revalidatePath("/");
    return { ok: true, data: { id: item.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create news";
    return { ok: false, error: msg };
  }
}

export async function deleteNewsAction(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/news");
    revalidatePath("/");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete news";
    return { ok: false, error: msg };
  }
}

// --- Project Actions ---
export async function createProjectAction(input: {
  title: string;
  slug: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("ADMIN");
    const item = await ContentService.createProject({
      title: input.title,
      slug: input.slug,
      description: input.description,
      repoUrl: input.repoUrl,
      liveUrl: input.liveUrl,
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/projects");
    revalidatePath("/");
    return { ok: true, data: { id: item.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return { ok: false, error: msg };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/projects");
    revalidatePath("/");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete project";
    return { ok: false, error: msg };
  }
}

// --- Sponsor Actions ---
export async function createSponsorAction(input: {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("ADMIN");
    const item = await prisma.sponsor.create({
      data: {
        name: input.name,
        logoUrl: input.logoUrl,
        websiteUrl: input.websiteUrl,
        tier: input.tier,
      },
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/");
    return { ok: true, data: { id: item.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create sponsor";
    return { ok: false, error: msg };
  }
}

export async function deleteSponsorAction(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await prisma.sponsor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/website");
    revalidatePath("/");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete sponsor";
    return { ok: false, error: msg };
  }
}
