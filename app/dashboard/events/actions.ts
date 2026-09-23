"use server";

import { revalidatePath } from "next/cache";
import { EventService } from "@/lib/services/event.service";
import { RoleEnum, EventStatus } from "@prisma/client";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

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

export interface EventParticipantItem {
  id: string;
  name: string;
  registerNumber: string;
  vmNumber: string;
  department: string;
  year: string;
  subClubName: string;
  subClubId: string | null;
  selected: boolean;
}

export async function getEventParticipantsAction(eventId: string): Promise<
  ActionResult<{
    eventTitle: string;
    participants: EventParticipantItem[];
  }>
> {
  try {
    const { user, role } = await requireRole(RoleEnum.MODERATOR);
    const isScoped = role === "MODERATOR";
    const secretarySubClubId = user?.member?.subClubId ?? null;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: { select: { memberId: true } },
      },
    });

    if (!event) {
      return { ok: false, error: "Event not found" };
    }

    const selectedMemberIds = new Set(event.participants.map((p) => p.memberId));

    const members = await prisma.member.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        ...(isScoped && secretarySubClubId ? { subClubId: secretarySubClubId } : {}),
      },
      include: { subClub: { select: { name: true } } },
      orderBy: { lastName: "asc" },
    });

    const participants: EventParticipantItem[] = members.map((m) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`.trim(),
      registerNumber: m.registerNumber,
      vmNumber: m.vmNumber,
      department: m.department,
      year: m.year,
      subClubName: m.subClub?.name ?? "General",
      subClubId: m.subClubId,
      selected: selectedMemberIds.has(m.id),
    }));

    return {
      ok: true,
      data: {
        eventTitle: event.title,
        participants,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load participants";
    return { ok: false, error: msg };
  }
}

export async function saveEventParticipantsAction(
  eventId: string,
  selectedMemberIds: string[],
  subClubScopedId?: string | null
): Promise<ActionResult> {
  try {
    const { user, role } = await requireRole(RoleEnum.MODERATOR);
    const isScoped = role === "MODERATOR";
    const filterSubClubId = isScoped ? user?.member?.subClubId : subClubScopedId;

    // Get current participants for this event
    const existing = await prisma.eventParticipant.findMany({
      where: {
        eventId,
        ...(filterSubClubId ? { member: { subClubId: filterSubClubId } } : {}),
      },
      select: { id: true, memberId: true },
    });

    const existingIds = new Set(existing.map((p) => p.memberId));
    const newSelected = new Set(selectedMemberIds);

    // Members to add
    const toAdd = selectedMemberIds.filter((id) => !existingIds.has(id));

    // Members to remove (from this sub-club scope)
    const toRemove = existing.filter((p) => !newSelected.has(p.memberId)).map((p) => p.id);

    if (toRemove.length > 0) {
      await prisma.eventParticipant.deleteMany({
        where: { id: { in: toRemove } },
      });
    }

    if (toAdd.length > 0) {
      await prisma.eventParticipant.createMany({
        data: toAdd.map((memberId) => ({
          eventId,
          memberId,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/od-documents");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save participants";
    return { ok: false, error: msg };
  }
}

