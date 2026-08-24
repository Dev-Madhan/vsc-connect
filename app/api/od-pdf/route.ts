/**
 * POST /api/od-pdf
 *
 * Accepts a GenerateODInput JSON body, renders the OD PDF using
 * @react-pdf/renderer server-side, and streams it back as
 * application/pdf for direct browser download.
 *
 * Access: MODERATOR and above only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import path from 'path';
import fs from 'fs/promises';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { generateODSchema } from '@/lib/validations/document.schema';
import { ODDocument } from '@/lib/pdf/od-template';

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  try {
    await requireRole('MODERATOR');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse & validate body ────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = generateODSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ── Resolve subClub names ────────────────────────────────────────────────
  const uniqueIds = [...new Set(data.students.map((s) => s.subClubId))];
  const subClubs = await prisma.subClub.findMany({
    where: { id: { in: uniqueIds }, deletedAt: null },
    select: { id: true, name: true },
  });
  const subClubNames: Record<string, string> = {};
  for (const sc of subClubs) subClubNames[sc.id] = sc.name;

  // ── Load college logo as base64 data URL ─────────────────────────────────
  let logoDataUrl = '';
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo', 'college logo.png');
    const logoBuffer = await fs.readFile(logoPath);
    logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (err) {
    // Logo missing — PDF renders without it rather than failing
    console.warn('[OD PDF] Could not load college logo:', err);
  }

  // ── Render PDF ────────────────────────────────────────────────────────────
  let pdfBuffer: Uint8Array;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elem = React.createElement(ODDocument as any, { data, subClubNames, logoDataUrl });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await renderToBuffer(elem as any);
    pdfBuffer = new Uint8Array(raw);
  } catch (err) {
    console.error('[OD PDF] Render error:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }

  // ── Stream response ───────────────────────────────────────────────────────
  const fileName = `OD_${data.fromName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(pdfBuffer.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': String(pdfBuffer.length),
    },
  });
}
