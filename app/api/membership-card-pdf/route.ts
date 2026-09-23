import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { MembershipCardDocument } from "@/lib/pdf/membership-card-template";
import type { MembershipCardData } from "@/lib/pdf/membership-card-template";

export async function GET(req: NextRequest) {
  // ── Auth & Role Check (Page 15: Super Admin & President only) ───────────
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  const role = dbUser?.role?.name ?? "USER";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isPresident = role === "ADMIN"; // President / Admin

  if (!isSuperAdmin && !isPresident) {
    return NextResponse.json(
      { error: "Forbidden: Only President and Super Admin can generate membership cards" },
      { status: 403 }
    );
  }

  // ── Parse Query ──────────────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const subClubId = searchParams.get("subClubId");

  const whereClause: Record<string, unknown> = { deletedAt: null };
  if (memberId) {
    whereClause.id = memberId;
  } else if (subClubId) {
    whereClause.subClubId = subClubId;
  }

  const members = await prisma.member.findMany({
    where: whereClause,
    include: { subClub: { select: { name: true } } },
    orderBy: { lastName: "asc" },
  });

  if (members.length === 0) {
    return NextResponse.json({ error: "No members found to generate cards" }, { status: 404 });
  }

  const cardsData: MembershipCardData[] = members.map((m) => ({
    id: m.id,
    name: `${m.firstName} ${m.lastName}`.trim(),
    membershipId: m.membershipId,
    subClubName: m.subClub?.name ?? "General Wing",
    registerNumber: m.registerNumber,
    department: m.department,
    year: m.year,
    gender: m.gender,
  }));

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elem = React.createElement(MembershipCardDocument as any, { cards: cardsData });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await renderToBuffer(elem as any);
    const pdfBuffer = new Uint8Array(raw);

    const fileName =
      cardsData.length === 1
        ? `Card_${cardsData[0].membershipId}.pdf`
        : `VSC_Membership_Cards_${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(pdfBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("[Membership Card PDF] Render error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
