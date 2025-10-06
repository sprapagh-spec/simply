import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function GiftsPage() {
  const gifts = await prisma.gift.findMany({
    include: { guest: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-surface">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ink">SimplyGift</h1>
          <p className="text-sm text-muted mt-1">Guest Invite Management</p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <a href="/" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50 transition-all">Guests</a>
          <a href="/gifts" className="rounded-xl px-4 py-3 text-sm font-medium bg-primary text-primary-foreground">Gifts</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="display text-3xl md:text-4xl text-ink">Gift Ledger</h1>
              <p className="text-muted mt-2">Track all gifts and their fee breakdowns</p>
            </div>
            <div className="flex gap-3">
              <Link href="/api/exports/ledger" className="btn-secondary">Export Ledger</Link>
            </div>
          </div>

          {gifts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="font-semibold text-xl text-ink mb-2">No gifts yet</h3>
              <p className="text-muted mb-6">Gifts will appear here once guests start giving</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-brand-50 border-b border-brand-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Guest</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Gross</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Platform Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Processing Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Net</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {gifts.map((gift) => (
                      <tr key={gift.id} className="hover:bg-brand-50 transition-all">
                        <td className="px-6 py-4">
                          <div className="font-medium text-ink">
                            {gift.guest.firstName} {gift.guest.lastName}
                          </div>
                          <div className="text-sm text-muted">{gift.guest.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {gift.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">${(gift.amountGrossCents / 100).toFixed(2)}</td>
                        <td className="px-6 py-4 text-muted">${(gift.platformFeeCents / 100).toFixed(2)}</td>
                        <td className="px-6 py-4 text-muted">${(gift.processingFeeCents / 100).toFixed(2)}</td>
                        <td className="px-6 py-4 font-semibold text-success">${(gift.amountNetCents / 100).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            gift.status === 'cleared' ? 'bg-success/10 text-success' :
                            gift.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-danger/10 text-danger'
                          }`}>
                            {gift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted">
                          {gift.createdAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

