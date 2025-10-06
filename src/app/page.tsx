import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({ 
    take: 50, 
    orderBy: { createdAt: 'desc' }, 
    include: { 
      household: true,
      gifts: {
        select: {
          amountGrossCents: true,
          amountNetCents: true,
          createdAt: true,
        }
      }
    } 
  });

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-surface">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ink">SimplyGift</h1>
          <p className="text-sm text-muted mt-1">Guest Invite Management</p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <a href="/" className="rounded-xl px-4 py-3 text-sm font-medium bg-primary text-primary-foreground">Guests</a>
          <a href="/gifts" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50 transition-all">Gifts</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="display text-3xl md:text-4xl text-ink">Guest Management</h1>
              <p className="text-muted mt-2">Import, invite, and track your guests and their gifts</p>
            </div>
            <div className="flex gap-3">
              <Link href="/guests/import" className="btn-primary">Import Guests</Link>
              <Link href="/api/exports/guests" className="btn-secondary">Export CSV</Link>
            </div>
          </div>

          {guests.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="font-semibold text-xl text-ink mb-2">No guests yet</h3>
              <p className="text-muted mb-6">Import your guest list from CSV or Google Sheets to get started</p>
              <Link href="/guests/import" className="btn-primary">Import Guests</Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-brand-50 border-b border-brand-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Household</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Lifetime Gross</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Last Gift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {guests.map((g) => {
                      const totalGross = g.gifts.reduce((sum, gift) => sum + gift.amountGrossCents, 0) / 100;
                      const lastGift = g.gifts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
                      
                      return (
                        <tr key={g.id} className="hover:bg-brand-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="font-medium text-ink">{g.firstName} {g.lastName}</div>
                          </td>
                          <td className="px-6 py-4 text-muted">{g.email ?? '—'}</td>
                          <td className="px-6 py-4 text-muted">{g.household?.name ?? '—'}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              {g.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {totalGross > 0 ? `$${totalGross.toFixed(2)}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-muted">
                            {lastGift ? lastGift.createdAt.toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
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

