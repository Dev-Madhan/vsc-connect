"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@prisma/client";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function broadcastNotificationAction(input: {
  title: string;
  message: string;
  type: NotificationType;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("ADMIN");
    const notif = await prisma.notification.create({
      data: {
        title: input.title,
        message: input.message,
        type: input.type,
      },
    });
    revalidatePath("/dashboard/notifications");
    return { ok: true, data: { id: notif.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to broadcast notification";
    return { ok: false, error: msg };
  }
}

export async function deleteNotificationAction(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await prisma.notification.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/notifications");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete notification";
    return { ok: false, error: msg };
  }
}
