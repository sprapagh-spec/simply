import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({ take: 50, orderBy: { createdAt: 'desc' }, include: { household: true } });
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Guests</h1>
        <div className="flex gap-2">
          <Link href="/guests/import" className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">Import CSV</Link>
          <Link href="/api/exports/guests" className="rounded border-2 border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Export CSV</Link>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-lg shadow-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Household</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{g.firstName} {g.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{g.email ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{g.household?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{g.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

