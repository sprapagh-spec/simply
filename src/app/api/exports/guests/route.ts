import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toCsvLine(values: (string | number | null | undefined)[]) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    })
    .join(',');
}

export async function GET() {
  const guests = await prisma.guest.findMany({
    include: {
      household: true,
      emails: {
        orderBy: { sentAt: 'desc' },
        take: 1,
      } as any,
      // Note: Prisma type may not have emails relation; we derive via Email model query instead
    },
  } as any);

  // If relation not available, fetch latest Email status per guest
  const latestStatuses = new Map<string, string | null>();
  const latestEmails = await prisma.email.findMany({
    orderBy: { sentAt: 'desc' },
    select: { guestId: true, status: true, sentAt: true },
  });
  for (const e of latestEmails) {
    if (!latestStatuses.has(e.guestId)) latestStatuses.set(e.guestId, e.status);
  }

  const header = [
    'guest_id',
    'email',
    'first_name',
    'last_name',
    'household_name',
    'status',
    'last_campaign_status',
    'created_at',
  ];
  const lines = [toCsvLine(header)];
  for (const g of guests) {
    const lastStatus = latestStatuses.get(g.id) ?? null;
    lines.push(
      toCsvLine([
        g.id,
        g.email ?? '',
        g.firstName,
        g.lastName,
        (g as any).household?.name ?? '',
        g.status,
        lastStatus,
        g.createdAt.toISOString(),
      ])
    );
  }

  const body = lines.join('\n');
  return new NextResponse(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="guests.csv"',
    },
  });
}

