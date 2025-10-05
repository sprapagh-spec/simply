import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const [grossAgg, netAgg, countAgg, last7, last30, emailAgg] = await Promise.all([
    prisma.gift.aggregate({ _sum: { amountGrossCents: true } }),
    prisma.gift.aggregate({ _sum: { amountNetCents: true } }),
    prisma.gift.aggregate({ _count: { _all: true } }),
    prisma.gift.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.gift.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.email.groupBy({ by: ['status'], _count: { _all: true } }).catch(() => [] as any),
  ]);
  const totalGross = (grossAgg._sum.amountGrossCents ?? 0) / 100;
  const totalNet = (netAgg._sum.amountNetCents ?? 0) / 100;
  const avg = (grossAgg._sum.amountGrossCents ?? 0) / Math.max(1, countAgg._count._all) / 100;
  const emailCounts = Object.fromEntries(emailAgg.map((e: any) => [e.status, e._count._all]));

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Total Gross</div>
          <div className="text-2xl font-semibold">${totalGross.toFixed(2)}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Total Net</div>
          <div className="text-2xl font-semibold">${totalNet.toFixed(2)}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Avg Gift</div>
          <div className="text-2xl font-semibold">${avg.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Gifts last 7 days</div>
          <div className="text-2xl font-semibold">{last7}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Gifts last 30 days</div>
          <div className="text-2xl font-semibold">{last30}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-muted-foreground">Email statuses</div>
          <div className="text-sm">sent: {emailCounts.sent ?? 0} • opened: {emailCounts.opened ?? 0} • clicked: {emailCounts.clicked ?? 0}</div>
        </div>
      </div>
    </main>
  );
}

