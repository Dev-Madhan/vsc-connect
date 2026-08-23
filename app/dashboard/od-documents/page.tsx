/**
 * /dashboard/od-documents
 *
 * Server component — resolves session, checks role, fetches sub-clubs,
 * then hands off to the client ODGeneratorView.
 *
 * Access: MODERATOR, ADMIN, SUPER_ADMIN only (enforced by layout + extra guard here).
 *
 * Scoping rules:
 *   - ADMIN / SUPER_ADMIN  → full access, all sub-clubs selectable
 *   - MODERATOR (tech)     → full access, all sub-clubs selectable (Tech generates ODs)
 *   - MODERATOR (other)    → scoped to their own sub-club only
 */

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { ODGeneratorView } from '@/components/dashboard/views/od-generator-view';

export default async function ODDocumentsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: true,
      member: { include: { subClub: true } },
    },
  });

  if (!dbUser) redirect('/login');

  const role = dbUser.role?.name ?? 'USER';
  if (role === 'USER') redirect('/login?error=unauthorized');

  // ── Resolve scoping ────────────────────────────────────────────────────────
  // Tech club moderator has the same full access as ADMIN/SUPER_ADMIN because
  // they are responsible for generating OD letters on behalf of all clubs.
  const subClubSlug = dbUser.member?.subClub?.slug ?? null;
  const isTechModerator = role === 'MODERATOR' && subClubSlug === 'tech';
  const isScoped = role === 'MODERATOR' && !isTechModerator;
  const secretarySubClubId = dbUser.member?.subClub?.id ?? null;

  // ── Fetch sub-clubs ────────────────────────────────────────────────────────
  // Fetches all non-deleted sub-clubs from the DB, then filters to exactly the
  // 7 permitted clubs (Dance · Music · Media · Tech · Compering · Fashion · Art)
  // in canonical order. Any other sub-clubs in the DB are excluded.
  // The view enforces scoping for MODERATOR via the isScoped flag.
  const subClubsRaw = await prisma.subClub.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, slug: true },
  });

  // Only these 7 clubs are permitted in OD documents — filter out any others
  const CLUB_ORDER = ['dance', 'music', 'media', 'tech', 'compering', 'fashion', 'art'];
  const subClubs = [...subClubsRaw]
    .filter((sc) => CLUB_ORDER.includes(sc.slug))
    .sort((a, b) => CLUB_ORDER.indexOf(a.slug) - CLUB_ORDER.indexOf(b.slug));

  return (
    <ODGeneratorView
      subClubs={subClubs}
      defaultSubClubId={isScoped ? (secretarySubClubId ?? '') : ''}
      isScoped={isScoped}
    />
  );
}
