import { prisma } from '@/lib/prisma';

export default async function GiftsTestPage() {
  try {
    const giftCount = await prisma.gift.count();
    const gifts = await prisma.gift.findMany({
      take: 3,
      include: { guest: true },
      orderBy: { createdAt: 'desc' },
    });

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Gifts Test</h1>
        <p>Gift count: {giftCount}</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Sample gifts:</h2>
          {gifts.map((gift) => (
            <div key={gift.id} className="p-2 border rounded">
              <p>Guest: {gift.guest.firstName} {gift.guest.lastName}</p>
              <p>Amount: ${(gift.amountGrossCents / 100).toFixed(2)}</p>
              <p>Method: {gift.method}</p>
              <p>Status: {gift.status}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Gifts Error</h1>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}
