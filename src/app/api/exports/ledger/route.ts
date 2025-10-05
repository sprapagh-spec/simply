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
  const gifts = await prisma.gift.findMany({
    include: { guest: true },
    orderBy: { createdAt: 'desc' },
  });
  const header = [
    'gift_id',
    'guest_id',
    'guest_email',
    'guest_name',
    'gross_cents',
    'platform_fee_cents',
    'processing_fee_cents',
    'net_cents',
    'currency',
    'status',
    'source',
    'created_at',
  ];
  const lines = [toCsvLine(header)];
  for (const g of gifts) {
    lines.push(
      toCsvLine([
        g.id,
        g.guestId,
        g.guest.email ?? '',
        `${g.guest.firstName} ${g.guest.lastName}`.trim(),
        g.amountGrossCents,
        g.platformFeeCents,
        g.processingFeeCents,
        g.amountNetCents,
        g.currency,
        g.status,
        g.source,
        g.createdAt.toISOString(),
      ])
    );
  }

  const body = lines.join('\n');
  return new NextResponse(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="ledger.csv"',
    },
  });
}

