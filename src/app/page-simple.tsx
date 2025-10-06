import { prisma } from '@/lib/prisma';

export default async function SimpleGuestsPage() {
  try {
    const guests = await prisma.guest.findMany({
      take: 5,
      orderBy: { firstName: 'asc' },
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
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-brand-50 border-b border-brand-100 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ink">RSVP Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {guests.map((g) => (
                      <tr key={g.id} className="hover:bg-brand-50 transition-all odd:bg-brand-50/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-ink text-[15px]">
                            {g.firstName} {g.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted text-[15px]">{g.email ?? '—'}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {g.rsvpStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}
