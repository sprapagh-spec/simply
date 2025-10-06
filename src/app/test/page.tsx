import { prisma } from '@/lib/prisma';

export default async function TestPage() {
  try {
    const guestCount = await prisma.guest.count();
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Database Test</h1>
        <p>Guest count: {guestCount}</p>
        <p>Database connection: ✅ Working</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Database Error</h1>
        <p>Error: {String(error)}</p>
        <p>Database connection: ❌ Failed</p>
      </div>
    );
  }
}
