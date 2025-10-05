import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function GuestPortal({ params }: { params: { guestId: string } }) {
  const guest = await prisma.guest.findUnique({ where: { id: params.guestId }, include: { household: true } });
  if (!guest) return <div className="p-6">Guest not found</div>;
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Welcome, {guest.firstName}</h1>
      <p className="text-sm text-muted-foreground">Household: {guest.household?.name ?? '—'}</p>
      <div className="mt-6 space-y-4">
        <form action="#" className="rounded border p-4">
          <h2 className="font-medium">RSVP</h2>
          <div className="mt-2 flex gap-4">
            <button className="rounded border px-3 py-2 text-sm">Attending</button>
            <button className="rounded border px-3 py-2 text-sm">Not Attending</button>
          </div>
        </form>
        <div className="rounded border p-4">
          <h2 className="font-medium">Give a Gift</h2>
          <Link href={`/portal/${guest.id}/give`} className="mt-2 inline-block rounded bg-primary px-3 py-2 text-primary-foreground text-sm">Give a Gift</Link>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-medium">Update Info</h2>
          <p className="text-sm text-muted-foreground">Coming soon.</p>
        </div>
      </div>
    </main>
  );
}

