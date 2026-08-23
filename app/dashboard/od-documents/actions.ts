'use server';

import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

// ── Shared result type ────────────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ── Fetch sub-clubs (for the club selector in the form) ───────────────────────
export async function getSubClubsAction(): Promise<
  ActionResult<{ id: string; name: string; slug: string }[]>
> {
  try {
    await requireRole('MODERATOR');
    const subClubs = await prisma.subClub.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
    return { ok: true, data: subClubs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load clubs';
    return { ok: false, error: msg };
  }
}
