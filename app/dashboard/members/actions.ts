"use server";

import { revalidatePath } from "next/cache";
import { MemberService } from "@/lib/services/member.service";
import { requireRole } from "@/lib/rbac";
import type { RegisterMemberInput, UpdateMemberInput } from "@/lib/validations/member.schema";

// ─── Shared result type ────────────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ─── Add member ───────────────────────────────────────────────────────────────
export async function addMemberAction(
  input: RegisterMemberInput
): Promise<ActionResult<{ id: string; membershipId: string }>> {
  try {
    await requireRole("MODERATOR");
    const member = await MemberService.registerMember(input);
    revalidatePath("/dashboard/members");
    return { ok: true, data: { id: member.id, membershipId: member.membershipId } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add member";
    return { ok: false, error: msg };
  }
}

// ─── Edit member ──────────────────────────────────────────────────────────────
export async function editMemberAction(
  input: UpdateMemberInput
): Promise<ActionResult> {
  try {
    await requireRole("MODERATOR");
    await MemberService.updateMember(input);
    revalidatePath("/dashboard/members");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update member";
    return { ok: false, error: msg };
  }
}

// ─── Remove member (soft delete) ─────────────────────────────────────────────
export async function removeMemberAction(
  memberId: string
): Promise<ActionResult> {
  try {
    await requireRole("MODERATOR");
    await MemberService.removeMember(memberId);
    revalidatePath("/dashboard/members");
    return { ok: true, data: undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to remove member";
    return { ok: false, error: msg };
  }
}
