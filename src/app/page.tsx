import { prisma } from '@/lib/prisma';

export default async function HomePage() {
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
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-card">
        <div className="p-4 text-lg font-semibold">SimplyGift</div>
        <nav className="flex flex-col gap-1 p-2">
          <a href="/" className="rounded px-3 py-2 text-sm bg-blue-100 text-blue-900">Dashboard</a>
          <a href="/guests" className="rounded px-3 py-2 text-sm hover:bg-gray-100">Guests</a>
          <a href="/gifts" className="rounded px-3 py-2 text-sm hover:bg-gray-100">Gifts</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="text-sm text-green-600 font-medium">Total Gross</div>
            <div className="text-3xl font-bold text-green-800">${totalGross.toFixed(2)}</div>
          </div>
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="text-sm text-blue-600 font-medium">Total Net</div>
            <div className="text-3xl font-bold text-blue-800">${totalNet.toFixed(2)}</div>
          </div>
          <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 shadow-sm">
            <div className="text-sm text-purple-600 font-medium">Avg Gift</div>
            <div className="text-3xl font-bold text-purple-800">${avg.toFixed(2)}</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6 shadow-sm">
            <div className="text-sm text-orange-600 font-medium">Gifts last 7 days</div>
            <div className="text-3xl font-bold text-orange-800">{last7}</div>
          </div>
          <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="text-sm text-indigo-600 font-medium">Gifts last 30 days</div>
            <div className="text-3xl font-bold text-indigo-800">{last30}</div>
          </div>
          <div className="rounded-lg border-2 border-pink-200 bg-pink-50 p-6 shadow-sm">
            <div className="text-sm text-pink-600 font-medium">Email Status</div>
            <div className="text-sm text-pink-800">sent: {emailCounts.sent ?? 0} • opened: {emailCounts.opened ?? 0} • clicked: {emailCounts.clicked ?? 0}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

