"use client";

/**
 * Client-side session context.
 *
 * Provides the current user's role and basic profile to all dashboard
 * components without prop-drilling. The data is injected once from the
 * server layout and never fetched client-side.
 */

import { createContext, useContext } from "react";
import type { RoleEnum } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
  role: RoleEnum;
  /** Human-readable role title shown in the sidebar */
  roleLabel: string;
  /** Sub-club name if the user is a MODERATOR */
  subClubName: string | null;
  /** Sub-club slug if the user is a MODERATOR */
  subClubSlug: string | null;
}

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSessionUser(): SessionUser {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessionUser must be used inside <SessionProvider>");
  }
  return ctx;
}
