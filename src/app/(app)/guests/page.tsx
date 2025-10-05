import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({ take: 50, orderBy: { createdAt: 'desc' }, include: { household: true } });
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Guests</h1>
        <div className="flex gap-2">
          <Link href="/guests/import" className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm">Import CSV</Link>
          <Link href="/api/exports/guests" className="rounded border px-3 py-2 text-sm">Export CSV</Link>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Household</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="px-3 py-2">{g.firstName} {g.lastName}</td>
                <td className="px-3 py-2">{g.email ?? '—'}</td>
                <td className="px-3 py-2">{g.household?.name ?? '—'}</td>
                <td className="px-3 py-2">{g.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

