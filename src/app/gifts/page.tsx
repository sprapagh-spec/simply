import { prisma } from '@/lib/prisma';

export default async function MinimalGiftsPage() {
  const gifts = await prisma.gift.findMany({
    include: { guest: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gifts (Minimal)</h1>
      <p>Found {gifts.length} gifts</p>
      <div className="mt-4 space-y-2">
        {gifts.map((gift) => (
          <div key={gift.id} className="p-2 border rounded">
            <p><strong>{gift.guest.firstName} {gift.guest.lastName}</strong></p>
            <p>Amount: ${(gift.amountGrossCents / 100).toFixed(2)}</p>
            <p>Method: {gift.method}</p>
            <p>Status: {gift.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
