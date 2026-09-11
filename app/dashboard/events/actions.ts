"use server";

import { revalidatePath } from "next/cache";
import { EventService } from "@/lib/services/event.service";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import type { EventStatus } from "@prisma/client";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createEventAction(input: {
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location?: string;
  clubId?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("MODERATOR");
    const event = await EventService.createEvent({
      title: input.title,
      slug: input.slug,
      description: input.description,
      eventDate: new Date(input.eventDate),
      location: input.location,
      clubId: input.clubId,
    });
    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    revalidatePath("/");
    return { ok: true, data: { id: event.id } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create event";
    return { ok: false, error: msg };
  }
}

export async function updateEventStatusAction(
  eventId: string,
  status: EventStatus
): Promise<ActionResult> {
  try {
    await requireRole("MODERATOR");
    await prisma.event.update({
      where: { id: eventId },
      data: { status },
    });
    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    revalidatePath("/");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update event status";
    return { ok: false, error: msg };
  }
}

export async function deleteEventAction(eventId: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await prisma.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/dashboard/events");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete event";
    return { ok: false, error: msg };
  }
}
