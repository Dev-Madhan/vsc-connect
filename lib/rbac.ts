import { auth } from "./auth";
import { headers } from "next/headers";
import { RoleEnum } from "@prisma/client";
import { prisma } from "./prisma";

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers()
  });
};

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
};

const roleHierarchy: Record<RoleEnum, number> = {
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Base role requirement.
 */
export const requireRole = async (minimumRole: RoleEnum) => {
  const session = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true, member: { include: { subClub: true } } }
  });

  const userRoleName = user?.role?.name || RoleEnum.USER;

  if (roleHierarchy[userRoleName] < roleHierarchy[minimumRole]) {
    throw new Error("FORBIDDEN");
  }

  return { session, user, role: userRoleName };
};

// --- Granular Permission Helpers ---

export const canManageUsers = async () => {
  const { role } = await requireRole(RoleEnum.SUPER_ADMIN);
  return true; // Only Super Admins
};

export const canManageEvents = async () => {
  // President, VP (ADMIN) and above can manage events
  const { role } = await requireRole(RoleEnum.ADMIN);
  return true; 
};

export const canManageMedia = async () => {
  // MODERATOR is base requirement, but must specifically be Media Secretary, or ADMIN/SUPER_ADMIN
  const { user, role } = await requireRole(RoleEnum.MODERATOR);
  
  if (role === RoleEnum.SUPER_ADMIN || role === RoleEnum.ADMIN) {
    return true;
  }
  
  // If MODERATOR, they must be attached to the 'media' subclub
  const isMediaSec = user?.member?.subClub?.slug === 'media';
  if (!isMediaSec) {
    throw new Error("FORBIDDEN: Requires Media privileges");
  }
  
  return true;
};

export const canManageSubClub = async (targetSubClubId: string) => {
  // President, VP, Super Admin can manage ANY sub club
  const { user, role } = await requireRole(RoleEnum.MODERATOR);

  if (role === RoleEnum.SUPER_ADMIN || role === RoleEnum.ADMIN) {
    return true;
  }

  // If MODERATOR (Secretary), they can ONLY manage their assigned sub-club
  if (user?.member?.subClubId !== targetSubClubId) {
    throw new Error("FORBIDDEN: Resource-Level Access Denied for this Sub-Club");
  }

  return true;
};
